from django.urls import path, include
from django.contrib import admin
# from accounts.views import home
# from .views import VideoUploadView, VideoListView, AnnotationView
from .views import MyVideosView

urlpatterns = [
    # path('', home, name = 'home'),
    # path('admin/', admin.site.urls),
    # path('api/accounts/', include('accounts.urls')), 
    # path('my-videos/', MyVideosView.as_view(), name='my-videos'), 
]