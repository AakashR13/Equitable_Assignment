# video_annotation_backend/views.py
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import FileResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
import uuid
import os
import mimetypes
import logging
from django.core.files.storage import default_storage
logger = logging.getLogger(__name__)

def userid(u):
    return str(uuid.uuid3(uuid.NAMESPACE_URL,u))

def getfiles(a): # string
    ab = 'data/'+userid(a)
    files = []
    try: 
        # list folder
        files = os.listdir(ab)
    except:
        return []
    return files
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        password_confirm = request.data.get('password_confirm')

        # Check if username and password are provided
        if not username or not password or not password_confirm:
            return Response({"error": "Username and passwords are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if passwords match
        if password != password_confirm:
            return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if username already exists
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user
        try:
            os.mkdir('data/'+userid(username))
            User.objects.create_user(username=username, password=password)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "User created successfully."}, status=status.HTTP_201_CREATED)
    
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = authenticate(username=username, password=password)
            if user is not None:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'token': str(token)}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetFileInfo(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, file_name):
        # open the json file and send the data
        dname = 'data/'+userid(request.user.username) + '/' + file_name + '/data.json'
        if not request.user.is_authenticated or file_name not in getfiles(request.user.username):
            return Response({'error': 'User unauthenticated'}, status=401)
        try:
            with open(dname, 'r') as f:
                data = json.load(f)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def post(self, request, file_name):
        # open the json file and send the data
        if not request.user.is_authenticated or file_name not in getfiles(request.user.username):
            return Response({'error': 'User unauthenticated'}, status=401)
        try:
            dname = 'data/'+userid(request.user.username) + '/' + file_name + '/data.json'
            with open(dname, 'w') as f:
                json.dump(request.data, f)
            return Response({'message': 'File updated'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GetUserView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Ensure the user is authenticated
            if request.user.is_authenticated:
                return Response({
                    'username': request.user.username,  
                    'files': getfiles(request.user.username) # array of names
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class VideoView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated] 
    def get(self, request, file_name):
        instance = self
        # if request.query_params.get('file'):
        fileuid = file_name
        # file_path = instance.file.path
        if  (not request.user.is_authenticated or fileuid not in getfiles(request.user.username)):
            return Response({'error': 'User  authenticated'}, status=401)
        file_path = 'data/'+userid(request.user.username)+'/'+fileuid + '/video.mp4'

        logger.info(f"Video path: {file_path}")

        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            content_type, encoding = mimetypes.guess_type(file_path)
            
            logger.info(f"Serving video: {file_path}")
            logger.info(f"File size: {file_size} bytes")
            logger.info(f"Content-Type: {content_type}")
            logger.info(f"Encoding: {encoding}")

            response = FileResponse(open(file_path, 'rb'), content_type=content_type or 'video/mp4')
            response['Content-Length'] = str(file_size)
            response['Accept-Ranges'] = 'bytes'
            response['Content-Disposition'] = f'inline; filename="{os.path.basename(file_path)}"'
            
            for header, value in response.items():
                logger.info(f"Response header - {header}: {value}")

            return response
        else:
            logger.error(f"Video file not found: {file_path}")
            return Response({'error': 'Video file not found'}, status=404)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'User unauthenticated'}, status=401)
        file = request.FILES.get('file')
        if file and file.size <= 100 * 1024 * 1024:  # File size limit 100MB
            videoUid = userid(file.name)
            save_file_name = 'data/'+ userid(request.user.username) + '/' + videoUid + '/'
            if os.path.exists(save_file_name):
                return Response({'error': 'File already exists'}, status=400)
            default_storage.save(save_file_name+'video.mp4', file)
            fileinfo = {
                "tags": [],
                "filename": file.name
            }
            # default_storage.save(save_file_name+'data.json', json.dumps(fileinfo).encode())
            with open(save_file_name+'data.json', 'w') as f:
                json.dump(fileinfo, f)
            return Response({'video_url': videoUid})
        return Response({'error': 'File too large or invalid format'}, status=400)



'''
fileinfo
{
    "tags": [
        { "timestamp": 123123123123213,
        "tag": "car",
        }
    ],
    "filename": "abc.txt"
}
'''

class UpdateJson(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
