import logging
import requests
import json
import random
import string

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import AccessToken

from accounts.models import User, Profile
from accounts.serializers import (
    UserSerializer,
    ProfileSerializer,
)
from pong import settings
from pong.utils import CustomError, CookieTokenAuthentication, wrap_data
from .models import OAuth, TwoFactorAuth
from .utils import get_token_for_user, set_cookie_response


logger = logging.getLogger("authenticate.oauth")


class OAuthView(APIView):
    def joinUserData(self, user):
        profile = Profile.objects.get(user=user)
        userJson = UserSerializer(user).data
        profileJson = ProfileSerializer(profile).data
        return wrap_data(user=userJson, profile=profileJson)

    def get(self, request):
        access_token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE"])
        if access_token:
            try:
                user, _ = CookieTokenAuthentication().authenticate(request)
                response = Response(self.joinUserData(user), status=status.HTTP_200_OK)
                return response
            except Exception:
                pass

        try:
            code = request.GET.get("code")
            response = self.request42OAuth(code)
            userData = self.request42UserData(response.json()["access_token"])
            user, profile = self.createUserProfileOauth(userData, response)
            if profile.two_factor_auth:
                self.do_2fa(user)
                data = wrap_data(email=profile.email, intra_id=user.intra_id)
                return Response(data=data, status=status.HTTP_428_PRECONDITION_REQUIRED)
            token = get_token_for_user(user)
            logger.debug(
                f"User {user} get token: {AccessToken(token['access']).payload}"
            )
            response = Response(self.joinUserData(user), status=status.HTTP_200_OK)
            response = set_cookie_response(response, token["access"], token["refresh"])
            return response
        except Exception as e:
            raise CustomError(e) from e

    def do_2fa(self, user):
        two_factor_auth, _ = TwoFactorAuth.objects.get_or_create(user=user)
        two_factor_auth.send_secret_code()

    def request42OAuth(self, code):
        data = {
            "grant_type": "authorization_code",
            "client_id": settings.CLIENT_ID,
            "client_secret": settings.CLIENT_SECRET,
            "code": code,
            "redirect_uri": settings.CALLBACK_URL,
        }
        headers = {"Content-Type": "application/json"}
        response = requests.post(
            settings.TOKEN_URL,
            data=json.dumps(data),
            headers=headers,
        )
        if response.status_code != 200:
            raise CustomError(response.text, status_code=response.status_code)
        return response

    def request42UserData(self, access_token):
        userData = requests.get(
            "https://api.intra.42.fr/v2/me",
            headers={"Authorization": "Bearer " + access_token},
        )
        if userData.status_code != 200:
            raise CustomError(userData.text, status_code=userData.status_code)
        return userData

    def createUserProfileOauth(self, userData, response):
        data = {
            "intra_id": userData.json()["login"],
            "username": userData.json()["login"],
            "email": userData.json()["email"],
        }
        try:
            user = User.objects.get(intra_id=data["intra_id"])
            return user, user.profile
        except User.DoesNotExist:
            pass

        try:
            serializer = UserSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            nickname = data["intra_id"]
            email = data["email"]

            while True:
                new_nickname = nickname
                new_email = email
                if Profile.objects.filter(nickname=nickname).exists():
                    new_nickname = nickname + self.generate_random_string()
                if Profile.objects.filter(email=email).exists():
                    new_email = (
                        email.split("@")[0]
                        + self.generate_random_string()
                        + "@"
                        + email.split("@")[1]
                    )
                if (
                    not Profile.objects.filter(nickname=new_nickname).exists()
                    and not Profile.objects.filter(email=new_email).exists()
                ):
                    break

            profile = Profile.objects.create(
                user=user,
                nickname=new_nickname,
                email=new_email,
                avatar="",
            )
            oauth = OAuth.objects.create(
                user=user,
                access_token=response.json()["access_token"],
                refresh_token=response.json()["refresh_token"],
                token_type=response.json()["token_type"],
            )
            return user, profile
        except Exception as e:
            if user:
                user.delete()
            if profile:
                profile.delete()
            if oauth:
                oauth.delete()
            raise CustomError(e, status_code=status.HTTP_400_BAD_REQUEST) from e

    def generate_random_string(self, length=3):
        letters = string.ascii_lowercase
        return "".join(random.choice(letters) for _ in range(length))
