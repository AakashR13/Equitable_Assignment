from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.conf import settings
import os

class VideoUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        file = request.FILES.get('file')
        if file and file.size <= 100 * 1024 * 1024:  # File size limit 100MB
            file_name = default_storage.save(os.path.join('videos', file.name), file)
            video_url = default_storage.url(file_name)
            return Response({'video_url': video_url})
        return Response({'error': 'File too large or invalid format'}, status=400)

class MyVideosView(APIView):
    def get(self, request):
        # Dummy example: You should query the database for user's videos and annotations
        videos = [
            {
                'url': '/media/videos/video1.mp4',
                'annotations': [
                    {'tag': 'Car', 'time': 10.5},
                    {'tag': 'Tree', 'time': 20.3},
                ]
            }
        ]
        return Response(videos)

