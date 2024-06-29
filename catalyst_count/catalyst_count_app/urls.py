from django.urls import path
from .views import UserCreateAPIView, UserLoginAPIView, UserLogoutAPIView, ActiveUserListAPIView, MyChunkedUploadCompleteView, MyChunkedUploadView, calculate_md5, CompanyList


urlpatterns = [
    path('user/register/', UserCreateAPIView.as_view(), name='user-register'),
    path('user/login/', UserLoginAPIView.as_view(), name='user-login'),
    path('logout/', UserLogoutAPIView.as_view(), name='logout'),
    path('active-users/', ActiveUserListAPIView.as_view(), name='active-users'),
    
    path('upload/', MyChunkedUploadView.as_view(), name='MyUpload'),
    path('upload-complete/', MyChunkedUploadCompleteView.as_view(), name='chunked_upload_complete'),  
    path('calculate-md5/', calculate_md5, name='calculate_md5'),  
    path('companies/', CompanyList.as_view(), name='company_list'),
]