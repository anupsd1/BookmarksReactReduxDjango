from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from .models import LocalUser, GmailAccount, UserProfile
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
# from rest_framework.authentication import authenticate
# from knox.models import AuthToken
from knox.auth import TokenAuthentication

from itertools import chain
from operator import attrgetter

from django.contrib.auth import login

# If we use model = User in any of the following, it will return an error-
# NoneType object does not have an attribute _meta
# Because in settings.py we have specified -
# AUTH_USER_MODEL = 'LocalUser.LocalUser'

    # permission_classes = (
    #     permissions.IsAuthenticated,
    # )
    #
    # authentication_classes = (
    #     TokenAuthentication,
    # )


class UserProfileSerializer(serializers.HyperlinkedModelSerializer):
    # profile_id = serializers.PrimaryKeyRelatedField(queryset=LocalUser.objects.all())
    class Meta:
        model = UserProfile
        fields = ('id', 'email', 'premium', 'first_name', 'last_name')


# Change password
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


# Forgot Password RESET
# class ForgotPasswordSerializer(serializers.Serializer):
#     email = serializers.EmailField(required=False)
#     new_password = serializers.CharField(required=False)
#
#     def validate_email(self, data):
#         # print("DATA IS = "+data)
#         context_user = self.context.get("user")
#         # print("USER IS = "+str(context_user))
#         # localuser = LocalUser.objects.get(username=context_user)
#         received_email = data
#         if context_user.email == received_email:
#             print("EMAIL IS VALID")
#         else:
#             print("EMAIL IS NOT VALID ")

class CheckTokenSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class CustomTokenSerializer(serializers.Serializer):
    token = serializers.CharField()


# Update premium for user
class PremiumUpdateSerializer(serializers.ModelSerializer):
    # premium = serializers.BooleanField(required=True)
    # email = serializers.EmailField()

    class Meta:
        model = UserProfile
        fields = ('id', 'premium')

    def update(self, instance, validated_data):
        # user = LocalUser.objects.get(username=instance)
        # user = instance
        #
        # if user and user.is_active:
        #     # newvalues = validated_data
        #     # for op in newvalues:
        #     #     print(op)
        #     #     # print(validated_data[op])
        #     #     user.op = validated_data[op]
        #     #     print("USER OP"+str(user.op))
        #     userinstance = LocalUser.objects.filter(username=str(user))
        #     print("User instance = "+str(userinstance))
        #     print((userinstance.get()))
        #     print("USER"+str(user))
        #     isupdated = userinstance.update(**validated_data)
        #     print(str(isupdated))
        #     # user.save()
        #     user = LocalUser.objects.get(username=user)
        #     return user
        # raise serializers.ValidationError('incorrect credentials')
        # print("INSTANCE[0]==="+instance[0])
        print("in update method????")
        print("INSTANCE ID = "+ str(instance.id))
        myinstance = UserProfile.objects.filter(id=instance.id)
        print("MY INSTANCE INITIALIZED!! ")

        updated = myinstance.update(**validated_data)
        # myinstance.save()

        # localuser_update = LocalUser.objects.filter(user=instance[0])
        # print("LOCAL USER UPDATED"+localuser_update)
        if updated:
            return myinstance[0]
        else:
            raise serializers.ValidationError('incorrect credentials')


class UserProfileEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('email',)


class UpdateEmailSerializer(serializers.ModelSerializer):
    old_email = serializers.EmailField()
    profile_serializer = UserProfileSerializer(allow_null=True, required=False, default=None)

    # HERE IF WE USE ANY OTHER NAME SUCH AS- new_email, it wont work
    # BECAUSE THIS NAME IS USED TO CHECK IN THE QUERYSET THAT WE HAVE MENTIONED IN UNIQUEVALIDATAOR
    email = serializers.EmailField(validators=[UniqueValidator(
                                                queryset=UserProfile.objects.all(),
                                                message="A user with email already exists")
                                            ])

    class Meta:
        model = LocalUser
        fields = ('old_email', 'email', 'profile_serializer')

    def validate_old_email(self, data):
        print("INSIDE OLD EMIAL VALIDATION")
        user = self.context.get("user")
        if user.email == data:
            # print("CORRENCT")
            # update_local_email = user.update(email=data)
            return data
        else:
            raise serializers.ValidationError("incorrect old email")

    def validate(self, data):
        print("INSIDE VALIDATION!!!")
        profile_data = data.get('profile_serializer')
        user = self.context.get("user")
        profile = user.profile_id
        profile_data['email'] = data.get('email')
        profile_data['first_name'] = "FROM SERIAL"
        profile_data['last_name']='AGAIN FROM SERIAL'
        res = UserProfileSerializer(profile, context=self.get_serializer_context()).data
        print(res)
        return UserProfileSerializer(profile, context=self.get_serializer_context()).data

    def update(self, instance, validated_data):
        local_query = LocalUser.objects.filter(id=instance.id)
        if local_query:
            print("inside localqeuery")
            # updated = local_query.update(email=validated_data['email'])
            profile_data = validated_data.pop('profile_serializer')
            profile = instance.profile_id
            instance.email = validated_data.get('email', instance.email)
            instance.save()

            profile.email = profile_data.get('email', profile.email)
            profile.save()
            print("NOW PROFILE EMAIL IS = "+profile_data.email)
            # if updated:
            #     # local_query.save()
            #     return local_query
            return instance
        else:
            raise serializers.ValidationError("Could not update")


# Register Serializer
class RegisterSerializer(serializers.HyperlinkedModelSerializer):
    # first_name = serializers.PrimaryKeyRelatedField(queryset=UserProfile.objects.all())
    first_name = serializers.CharField(max_length=200)
    last_name = serializers.CharField(max_length=200)

    def myqueryset(self):
        queryset = list(sorted(chain(
            UserProfile.objects.filter(UserProfile.objects.all()),
            LocalUser.objects.filter(LocalUser.objects.all())
        ),
            key=attrgetter('email'),
        ))
        return queryset

    # THE FOLLOWING LINE IS VERY IMPORTANT AND ONE OF THE MOST USEFUL THING!!!
    email = serializers.EmailField(validators=[UniqueValidator(
                                                queryset=LocalUser.objects.all(),
                                                message="A user with email already exists")
                                            ])

    class Meta:
        # model = User
        model = LocalUser
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
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

        userprofile = UserProfile.objects.create(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email']
        )
        # CALLING SAVE IS IMPORTANT
        userprofile.save()

        if userprofile:
            user = LocalUser.objects.create_user(
                validated_data['username'],
                validated_data['email'],
                validated_data['password']
                # validated_data['password2']
                # validated_data['premium']
            )

            user.profile_id = userprofile
            # CALLING SAVE IS IMPORTANT
            user.save()
        if user and userprofile:

            return userprofile

        raise serializers.ValidationError("Incorrect data")


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
    first_name = serializers.CharField(max_length=255, required=True)
    last_name = serializers.CharField(max_length=255, required=True)
    email = serializers.EmailField()
    provider = serializers.CharField(max_length=255, required=True)
    access_token = serializers.CharField(max_length=4096, required=True, trim_whitespace=True)
    user_id = serializers.CharField(max_length=4096, required=True)

    authentication_classes = (
        TokenAuthentication,
    )

   # def create(self, validated_data, *args, **kwargs):

class GoogleAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = GmailAccount
        fields = '__all__'


# User Serializer
class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile_id = serializers.PrimaryKeyRelatedField(queryset=UserProfile.objects.all())

    class Meta:
        model = LocalUser
        fields = ('id', 'username', 'email', 'profile_id')
