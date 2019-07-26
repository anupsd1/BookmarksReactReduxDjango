from rest_framework import serializers
from django.contrib.auth.models import User
from .models import LocalUser
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
# from rest_framework.authentication import authenticate
# from knox.models import AuthToken
from knox.auth import TokenAuthentication
from django.contrib.auth import login

# If we use model = User in any of the following, it will return an error-
# NoneType object does not have an attribute _meta
# Because in settings.py we have specified -
# AUTH_USER_MODEL = 'LocalUser.LocalUser'


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalUser
        fields = ('id', 'username', 'email')

    # permission_classes = (
    #     permissions.IsAuthenticated,
    # )
    #
    # authentication_classes = (
    #     TokenAuthentication,
    # )


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        # model = User
        model = LocalUser
        fields = ('id', 'username', 'email', 'password')
        # extra_kwargs = {'password': {'write_only': True}}

    authentication_classes = (
        TokenAuthentication,
    )

    def create(self, validated_data, *args, **kwargs):
        print("inside create")
        # user = User.objects.create(
        #     validated_data['username'],
        #     validated_data['email'],
        #     validated_data['password']
        #     #validated_data['password2']
        #     # validated_data['premium']
        # )

        # when it was LocalUser.objects.create(..)
        # it gave an error saying-
        # create() takes 1 positional argument but 4 were given

        user = LocalUser.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
            # validated_data['password2']
            # validated_data['premium']
        )

        return user


# LOGIN SERIALIZER
# Not using ModelSerializer because we are not dealing with creating a new object.
# We are simply validating the data that has been input
# user.is_active is inbuilt to validate the login credentials
class LoginSerializer(serializers.Serializer):
    # class Meta:
    #     model = LocalUser
    #     fields = ('username', 'password')
    username = serializers.CharField(max_length=300)
    password = serializers.CharField(max_length=300)

    authentication_classes = (
        TokenAuthentication,
    )
    # def has_object_permission(self, request, view, obj=None):
    #     # Write permissions are only allowed to the owner of the snippet
    #     return obj is None or obj.from_user == request.user
    #
    # def get_object(self):
    #     obj = get_object_or_404(self.get_queryset())
    #     self.check_object_permissions(self.request, obj)
    #     return obj

    def validate(self, data):
        print("Validattingg......")
        print("in vaidate")
        user = authenticate(**data)
        # print(user)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials ")


# Serializer which accepts an OAuth2 access token and provider
class SocialSerializer(serializers.Serializer):
    provider = serializers.CharField(max_length=255, required=True)
    access_token = serializers.CharField(max_length=4096, required=True, trim_whitespace=True)

    authentication_classes = (
        TokenAuthentication,
    )

    # def validate(self, data):
    #     print("Validattingg......")
    #     print("in vaidate")
    #     user = authenticate(**data)
    #     # print(user)
    #     if user and user.is_active:
    #         return user
    #     raise serializers.ValidationError("Incorrect Credentials ")