from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from requests.exceptions import HTTPError
# The following import and then adding it to authentication classes is very important. Without this:
# the error was Authentication credentials were not provided.
# Took 24 hours to figure this out
from django.contrib.auth import login

from knox.auth import TokenAuthentication
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.settings import api_settings
from knox.models import AuthToken
from knox.settings import knox_settings
from rest_framework.serializers import DateTimeField
from django.utils import timezone

from re import sub
from .models import LocalUser
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, SocialSerializer


from social_django.utils import load_strategy, load_backend
from social_core.backends.oauth import BaseOAuth2
from social_core.exceptions import MissingBackend, AuthTokenError, AuthForbidden


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

    def get_token_ttl(self):
        return knox_settings.TOKEN_TTL

    def get_token_limit_per_user(self):
        return knox_settings.TOKEN_LIMIT_PER_USER

    def get_user_serializer_class(self):
        return knox_settings.USER_SERIALIZER

    def get_expiry_datetime_format(self):
        return knox_settings.EXPIRY_DATETIME_FORMAT

    def format_expiry_datetime(self, expiry):
        datetime_format = self.get_expiry_datetime_format()
        return DateTimeField(format=datetime_format).to_representation(expiry)

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
        # login(request, user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            # "token": AuthToken.objects.create(user)[1]
            "token": AuthToken.objects.create(user=user)[1],
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


class SocialLoginView(generics.GenericAPIView):
    serializer_class = SocialSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    authentication_classes = (
        TokenAuthentication,
    )

    def post(self, request):
        # Authenticate through provider and access_token
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        provider = serializer.data.get('provider', None)
        strategy = load_strategy(request)

        try:
            backend = load_backend(strategy=strategy, name=provider, redirect_uri=None)
        except:
            return Response(
                {
                    'error': "Please provide a valid provider"
                },
                status=status.HTTP_400_BAD_REQUEST)

        try:
            if isinstance(backend, BaseOAuth2):
                access_token = serializer.data.get('access_token')
            user = backend.do_auth(access_token)
        except HTTPError as error:
            return Response({
                'error': {
                    'access_token': "Invalid Token",
                    "details": str(error)
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        except AuthTokenError as error:
            return Response({
                "error": "Invalid credentials",
                "details": str(error)
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            authenticated_user = backend.do_auth(access_token, user=user)

        except HTTPError as error:
            return Response({
                "error": "Invalid token",
                "details": str(error)
            }, status=status.HTTP_400_BAD_REQUEST)

        except AuthForbidden as error:
            return Response({
                "error": "Invalid token",
                "details": str(error)
            }, status=status.HTTP_400_BAD_REQUEST)

        if authenticated_user and authenticated_user.is_active:
            # generate Knox token
            login(request, authenticated_user)
            data = {
                "token": AuthToken.objects.create(authenticated_user)[1]
            }

            response = {
                "user": UserSerializer(authenticated_user, context=self.get_serializer_context()).data,
                "token": data.get('token')
            }

            return Response(response)



# class SocialLoginView(generics.GenericAPIView):
#     authentication_classes = (
#         TokenAuthentication,
#     )
#
#     serializer_class = SocialSerializer
#
#     def post(self, request, *args, **kwargs):
#         print("inside post")
#         print(request.data)
#         serializer = self.get_serializer(data=request.data)
#         # serializer = self.serializer_class(data=request.data, context={'request': request})
#         print("GOT SERIALIZER? ")
#         serializer.is_valid(raise_exception=True)
#         print("Done validation? ")
#
#
#         # login(request, user)
#         return Response({
#             "user": UserSerializer(user, context=self.get_serializer_context()).data,
#             # "token": AuthToken.objects.create(user)[1]
#             "token": AuthToken.objects.create(user=user)[1],
#             # "token": serializer.serialize('json', AuthToken.objects.create(user=user))
#             # "mytoken": AuthToken.objects.create(user=user)
#         })
