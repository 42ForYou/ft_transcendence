from django.urls import path
from .views import (
    LoginView,
    LogoutView,
    CustomTokenRefreshView,
    CustomTokenVerifyView,
    TwoFactorAuthView,
)
from .oauthviews import OAuthView


urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("oauth/", OAuthView.as_view(), name="oauth"),
    path("token/verify/", CustomTokenVerifyView.as_view(), name="token_verify"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("2fa/", TwoFactorAuthView.as_view(), name="2fa"),
]
