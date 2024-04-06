from django.db.models import Q
from rest_framework import viewsets, mixins, permissions, status
from rest_framework.response import Response

from pong.utils import (
    CustomError,
    CookieTokenAuthentication,
    CustomPageNumberPagination,
)
from accounts.models import Profile
from .models import Friend
from .serializers import FriendSerializer


class FriendViewSet(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.UpdateModelMixin,
):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    # 친구 신청
    def create(self, request, *args, **kwargs):
        try:
            data = request.data.get("data")
            data["requester"] = request.user.intra_id
            recevier = Profile.objects.get(nickname=data.get("receiver")).user
            data["receiver"] = recevier.intra_id
            if data["receiver"] == data["requester"]:
                raise CustomError(
                    "You can't send friend request to yourself",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            instance = serializer.save()
            serializer = FriendSerializer(instance, context={"request": request})
            return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            raise CustomError(e, status.HTTP_400_BAD_REQUEST) from e

    # 친구 목록
    def list(self, request, *args, **kwargs):
        try:
            paginator = CustomPageNumberPagination()
            user = request.user
            filter_val = request.query_params.get("filter", None)
            if filter_val in ["pending", "friend"]:
                if filter_val == "pending":
                    queryset = self.get_queryset().filter(
                        receiver=user, status="pending"
                    )
                elif filter_val == "friend":
                    queryset = self.get_queryset().filter(
                        Q(requester=request.user) | Q(receiver=request.user),
                        status=filter_val,
                    )
            else:
                raise CustomError(
                    "Invalid filter", status_code=status.HTTP_400_BAD_REQUEST
                )
            context = paginator.paginate_queryset(queryset, request)
            friends = FriendSerializer(
                context, many=True, context={"request": request, "filter": filter_val}
            )
            return paginator.get_paginated_response(friends.data)
        except Exception as e:
            raise CustomError(
                e, "Friend", status_code=status.HTTP_400_BAD_REQUEST
            ) from e

    def update(self, request, *args, **kwargs):
        try:
            friend_instance = self.get_object()
            if request.user != friend_instance.receiver:
                return Response(
                    {"error": "You are not the receiver of this friend request"},
                    status=status.HTTP_403_FORBIDDEN,
                )
            friend_instance.status = "friend"
            friend_instance.save()
            serializer = FriendSerializer(
                friend_instance, context={"request": request, "filter": "friend"}
            )
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            raise CustomError(
                e, "Friend", status_code=status.HTTP_400_BAD_REQUEST
            ) from e

    def destroy(self, request, *args, **kwargs):
        try:
            friend_instance = self.get_object()
            if request.user not in [
                friend_instance.requester,
                friend_instance.receiver,
            ]:
                return Response(
                    {
                        "error": "You are not the requster or receiver of this friend request"
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
            friend_instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            raise CustomError(
                e, "Friend", status_code=status.HTTP_400_BAD_REQUEST
            ) from e
