from django.shortcuts import render
from rest_framework.views import APIView
from django.http import HttpRequest
from django.contrib.auth.mixins import LoginRequiredMixin

from rest_framework.decorators import api_view, permission_classes
from django.views import View
from rest_framework import serializers, viewsets, permissions
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework import authentication
from .models import Bookmark
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from knox.auth import TokenAuthentication


# Create your views here.
class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ('id', 'lat', 'lon', 'user')

    print("inside bookmark serializer")
    permission_classes = (
        IsAuthenticated,
    )

    authentication_classes = (
        TokenAuthentication,

    )


#USER DEFINED PERMISSION
class IsPremiumUser(permissions.BasePermission):
    message = "Only premium users have access to this resource"

    def has_permission(self, request: HttpRequest, view: View):
        # return request.user.has_perm('appname.permname') #Django ACL Perms
        print(request.user.premium)
        return request.user.premium

    def has_object_permission(self, request: HttpRequest, view: View, obj):
        # See if obj belongs to user?
        return request.user.premium


# class BookmarkViewSet(viewsets.ModelViewSet):
#     #permission_classes = (permissions.DjangoModelPermissions,) #its the default permission
#     permission_classes = (permissions.DjangoModelPermissions, OwnerOnly)
#     queryset = Bookmark.objects.all()
#     serializer_class = BookmarkSerializer
#
#     def get_queryset(self):
#         return Bookmark.objects.filter(user=self.request.user)

@method_decorator(ensure_csrf_cookie, name='create')
class BookmarkViewSet(
                    viewsets.GenericViewSet,
                    viewsets.mixins.ListModelMixin,
                    viewsets.mixins.RetrieveModelMixin,
                    viewsets.mixins.DestroyModelMixin
                    ):
    queryset = Bookmark.objects.all()
    permission_classes = (IsAuthenticated, IsPremiumUser)

    authentication_classes = (
        # authentication.SessionAuthentication,
        TokenAuthentication,
    )
    serializer_class = BookmarkSerializer

    print("inside bookmark viewset")

    # def get(self, request):
    #     print(request.user)

    # def get_authenticate_header(self, request):
    #     print(request.data)

    def get_queryset(self):
        # print(self.request.header)
        # print("USER IS "+self.request.user.username)
        if not self.request.user.is_staff:
            return Bookmark.objects.filter(user=self.request.user)
        else:
            return Bookmark.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # if we would have used CreateModelMixin,
        # then we would not have been able to check
        # the following condition
        if request.data['user'] != str(request.user.id):
            raise PermissionDenied("You cannot make bookmarks for other people!")
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)



# ONLY FOR BROWSING
@method_decorator(ensure_csrf_cookie, name='create')
class BookmarkBrowseViewSet(
        viewsets.GenericViewSet,
        viewsets.mixins.ListModelMixin,
        viewsets.mixins.RetrieveModelMixin,
        viewsets.mixins.DestroyModelMixin
    ):
    queryset = Bookmark.objects.all()
    permission_classes = (IsAuthenticated, IsPremiumUser)

    authentication_classes = (
        authentication.SessionAuthentication,
        # TokenAuthentication,
    )
    serializer_class = BookmarkSerializer

    print("inside bookmark viewset")

    # def get(self, request):
    #     print(request.user)

    # def get_authenticate_header(self, request):
    #     print(request.data)

    def get_queryset(self):
        # return Bookmark.objects.filter(user=self.request.user)
        if not self.request.user.is_staff:
            qs = Bookmark.objects.filter(user=self.request.user)
            if qs:
                return qs
            else:
                return None
        else:
            qs = Bookmark.objects.all()
            if qs:
                return qs
            else:
                return None

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # if we would have used CreateModelMixin,
        # then we would not have been able to check
        # the following condition
        if request.data['user'] != str(request.user.id):
            raise PermissionDenied("You cannot make bookmarks for other people!")
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    #Need the following when using only GenericViewSet
    # but because of the mixins included we can do without them
    '''
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    '''



# Example of a single API Function
# Route with: url(r'^api/bookmarks', include('bookmarks.urls'))
'''
@api_view(['GET', 'HEAD'])
@permission_classes((IsAuthenticated, IsPremiumUser))
def list_my_bookmarks(request, format=None):
    user_bookmarks = Bookmark.objects.filter(user=request.user)
    return Response(BookmarkSerializer(user_bookmarks, many=True).data)
'''












