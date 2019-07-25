from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
# The following import and then adding it to authentication classes is very important. Without this:
# the error was Authentication credentials were not provided.
# Took 24 hours to figure this out
from django.contrib.auth import login

from knox.auth import TokenAuthentication
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.settings import api_settings
from knox.models import AuthToken
from re import sub
from .models import LocalUser
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer

# The following is very important, otherwise django's basic token authentication is used
# authentication_classes = (
#         TokenAuthentication,
#     )
# IMPORTANT!!-
# ANY TYPE OF TOKEN AUTHENTICATION CANNOT BE USED WITH THE BROWSEABLE DJANGO API


# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    authentication_classes = (
        TokenAuthentication,
    )

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print(serializer)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        print(self.get_serializer_context())
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,

            # In the video it was :
            #     "token": AuthToken.objects.create(user)
            # which gave an error.
            # Answer-
            # The Token.objects.create returns a tuple (instance, token). So in order to get token use the index 1
            # "token": AuthToken.objects.create(user)[1]

            "token": AuthToken.objects.create(user)[1]
        })


# Login API
class LoginAPI(generics.GenericAPIView):
    # login_url = 'api/auth/login/'
    print("BEFORE SERIALIZER CLASS")
    # permission_classes = [
    #     permissions.IsAuthenticated,
    # ]

    authentication_classes = (
        TokenAuthentication,
    )

    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        print("inside post")
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        # serializer = self.serializer_class(data=request.data, context={'request': request})
        print("GOT SERIALIZER? ")
        serializer.is_valid(raise_exception=True)
        print("Done validation? ")

        # was written as
        # user = serializer.validate_data
        # which gave an error
        user = serializer.validated_data
        login(request, user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            # "token": AuthToken.objects.create(user)[1]
            "token": AuthToken.objects.create(user)[1],
            # "token": serializer.serialize('json', AuthToken.objects.create(user=user))
            # "mytoken": AuthToken.objects.create(user=user)
        })


# Get User API
# class UserAPI(
#                 viewsets.GenericViewSet,
#                 viewsets.mixins.ListModelMixin,
#                 viewsets.mixins.RetrieveModelMixin,
#                 viewsets.mixins.DestroyModelMixin):

class UserAPI(generics.RetrieveAPIView):

    permission_classes = [

        permissions.IsAuthenticated,
        # permissions.AllowAny,
    ]

    authentication_classes = (
        TokenAuthentication,
    )

    queryset = LocalUser.objects.all()

    serializer_class = UserSerializer

    # def get(self, request, format=None):
    #     content = {
    #         'user': (request.user),  # `django.contrib.auth.User` instance.
    #         'auth': (request.auth),  # None
    #     }
    #     print(content)
    #     return Response(content)

    def get_queryset(self):
        return LocalUser.objects.filter(user=self.request.user)

    def get_object(self):
        return self.request.user

    # def get_object(self):
    #     header_token = self.request.META.get('HTTP_AUTHORIZATION', None)
    #     print(header_token)
    #     if header_token is not None:
    #         try:
    #             token = sub('Token ', '', self.request.META.get('HTTP_AUTHORIZATION', None))
    #             print(*token)
    #             print(len(token))
    #             mytoken = token
    #             print(*token)
    #             # token_obj = type(AuthToken.objects.get(token[0]))
    #             # for field, possible_values in AuthToken.objects.get(token).iteritems():
    #             #     print(field, possible_values)
    #             print(AuthToken.objects.get(self.request.user))
    #
    #             # print(token_obj)
    #            # self.request.user = token_obj.user
    #         except AuthToken.DoesNotExist:
    #             raise Exception("Does not exist")
    #         # This is now the correct user
    #
    #     return self.request.user
    #
    # def myfunc(self, *args, **kwargs):
    #     print(*args)
    #     print(**kwargs)


class UserViewSet(viewsets.ModelViewSet):
    queryset = LocalUser.objects.all()
    serializer_class = UserSerializer

    authentication_classes = (
        TokenAuthentication,
    )

    # print(permissions.IsAuthenticated)

    def retrieve(self, request, pk=None):
        print("User is "+self.request.user)

