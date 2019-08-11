from django.urls import path, include
from django.conf.urls import url
from .api import RegisterAPI, LoginAPI, UserAPI, SocialLoginView, UserUpdateAPI, ChangePasswordAPI, ChangeEmailView
from knox import views as knox_views
from knox import auth
from django.contrib.auth.decorators import login_required


urlpatterns = [


    url(r'api/auth/login/', (LoginAPI.as_view()), name='mylogin'),
    # The above path was written after including knox.urls which gave errors which were not specific.
    # The error was Authentication credentials are not provided.
    # It took  almost 24 hours to figure this out.
    # By just guessing I put the path above and things started coming together :)




    # this works- path('api/auth/user/', UserAPI.as_view()),
    path(r'api/auth/user/', UserAPI.as_view()),
    path(r'api/auth/register/', RegisterAPI.as_view()),
    path(r'api/auth/logout/', knox_views.LogoutView.as_view(), name="knox_logout"),
    path(r'api/auth/logallout/', knox_views.LogoutAllView.as_view(), name='knox_logallout'),
    path(r'api/auth/updatepremium/', UserUpdateAPI.as_view()),
    path(r'api/auth/changepassword/', ChangePasswordAPI.as_view()),
    path(r'newauth/login/', SocialLoginView.as_view()),
    path(r'api/auth/email/', ChangeEmailView.as_view()),
    # this works- path('api/auth/user/', UserAPI.as_view()),
    path(r'newauth/', include('rest_framework_social_oauth2.urls')),
    path(r'api/myauth/', include('knox.urls'))
]
