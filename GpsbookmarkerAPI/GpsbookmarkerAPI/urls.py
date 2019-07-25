from django.conf.urls import url, include
from django.contrib import admin

from django.contrib.auth.models import User, Group, AbstractUser
from rest_framework import serializers, viewsets, routers
from django.views.decorators.csrf import ensure_csrf_cookie
from bookmarks.models import Bookmark
from bookmarks.views import BookmarkViewSet, BookmarkBrowseViewSet
from LocalUser.models import LocalUser
from django.urls import path
from knox import auth

from LocalUser.api import UserAPI, LoginAPI, RegisterAPI, UserViewSet
# from LocalUser.views import register_page


# To use routers, we can use only class based views and not function based views
router = routers.DefaultRouter()
# router.register(r'users', UserViewSet)
# router.register(r'users', UserAPI)
# router.register(r'groups', GroupViewSet)
router.register(r'bookmarks', BookmarkViewSet)


urlpatterns = [
    path('', include('frontend.urls')),
    url(r'^admin/', admin.site.urls),
    # url(r'^letslogin/', register_page),
    url(r'^api/', (include(router.urls))),
    # url(r'^api-auth/', include('rest_framework.urls'), {'authentication_classes': (auth.TokenAuthentication, )}),
    # url(r'^api-auth', include('rest_framework.urls')),
    # url(r'^api/bookmarks', include('bookmarks.urls')),
    url(r'^rest-auth/', include('rest_auth.urls'), {'authentication_classes': (auth.TokenAuthentication, )}),
    path('', include('LocalUser.urls')),
    # url(r'^api-auth', include('rest_framework.urls')),
]




# class UserSerializer(serializers.HyperlinkedModelSerializer):
#     bookmarks = serializers.PrimaryKeyRelatedField(many=True, queryset=Bookmark.objects.all())
#
#     class Meta:
#         model = LocalUser
#         fields = ('url', 'username', 'email', 'is_staff', 'bookmarks')
#
#
# class GroupSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = Group
#         fields = ('url', 'name')
#
#
# class UserViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows users to be viewed or edited.
#     """
#     '''
#     With the ModelViewSet you get all the CRUD methods for free.
#     With the GenericViewSet you can write your own custom methods.
#     '''
#     queryset = LocalUser.objects.all()
#     serializer_class = UserSerializer
#
#
# class GroupViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows groups to be viewed or edited.
#     """
#     queryset = Group.objects.all()
#     serializer_class = GroupSerializer
#
