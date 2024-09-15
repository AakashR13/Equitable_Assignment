from django.urls import path, include
from .views import RegisterView, LoginView, GetUserView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    # path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', GetUserView.as_view(), name='get_user'),
]
                                    