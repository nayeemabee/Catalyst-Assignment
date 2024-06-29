from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from chunked_upload.views import ChunkedUploadView, ChunkedUploadCompleteView

from .serializers import UserSerializer, ActiveUserSerializer, CompanySerializer
from .models import MyUpload, Company
from django.contrib.auth.models import User

import csv
import hashlib

# Create your views here.

class UserCreateAPIView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

class UserLoginAPIView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        print(username, password)

        user = authenticate(username=username, password=password)

        print(user)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid credentials'}, status=400)
        
class UserLogoutAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        Token.objects.filter(user=user).delete()
        return Response({'message': 'Successfully logged out'}, status=200)
    
    
class ActiveUserListAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ActiveUserSerializer

    def get_queryset(self):
        return User.objects.filter(is_active=True)    


class MyChunkedUploadView(ChunkedUploadView):
    model = MyUpload

    def check_permissions(self, request):
        pass
    
    

class MyChunkedUploadCompleteView(ChunkedUploadCompleteView):
    model = MyUpload

    def check_permissions(self, request):
        pass

    def on_completion(self, uploaded_file, request):
        print('uploaded_file', uploaded_file)
        csv_data = uploaded_file.read().decode('utf-8').splitlines()
        csv_reader = csv.reader(csv_data)        
        
        for row in csv_reader:
            print(row)
    
            # Skip the row if it is empty or contains only null values
            if not row or all(value == '' or value is None for value in row):
                print(f"Skipping empty or null row: {row}")
                continue
        
            try:
                # Ensure the row has the expected number of columns
                if len(row) < 11:
                    print(f"Skipping row with insufficient columns: {row}")
                    continue
            
                # Replace any missing values in the row with None
                row = [(None if value == '' or value is None else value) for value in row]
            
            
                Company.objects.create(
                    company_id=row[0],
                    name=row[1],
                    domain=row[2],
                    year_founded=row[3],
                    industry=row[4],
                    size_range=row[5],
                    locality=row[6], 
                    country=row[7],  
                    linkedin_url=row[8],
                    current_employees_estimate=row[9],
                    total_employees_estimate=row[10]
                )
            except Exception as e:
                print(f"Error creating company for row {row}: {e}")
        
        
    def get_response_data(self, chunked_upload, request):
        return {'message': 'You did it!'}
    
  
  
@api_view(['POST'])
def calculate_md5(request):
    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']
    md5_hash = hashlib.md5()
    
    for chunk in file.chunks():
        md5_hash.update(chunk)
    
    md5_digest = md5_hash.hexdigest()
    return Response({'md5': md5_digest}, status=status.HTTP_200_OK)
        

class CompanyList(generics.ListAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        for param, value in self.request.query_params.items():
            if value:
                queryset = queryset.filter(**{param: value})
        return queryset
