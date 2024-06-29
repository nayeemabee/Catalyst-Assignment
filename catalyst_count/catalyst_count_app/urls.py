from django.urls import path
from .views import UserCreateAPIView, UserLoginAPIView


urlpatterns = [
    path('user/register/', UserCreateAPIView.as_view(), name='user-register'),
    path('user/login/', UserLoginAPIView.as_view(), name='user-login')
]