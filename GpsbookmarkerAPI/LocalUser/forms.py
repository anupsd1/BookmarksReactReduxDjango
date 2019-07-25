from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import LocalUser
from django import forms
from django.contrib.auth import get_user_model

#User = get_user_model()

# Create your views here.
# class CustomUserCreationForm(UserCreationForm):
#     class Meta(UserCreationForm):
#         model = LocalUser
#         fields = '__all__'


class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm):
        model = LocalUser
        fields = '__all__'


# class RegisterFrom(forms.Form):
#     username = forms.CharField()
#     email = forms.EmailField()
#     password = forms.CharField(
#         widget=forms.PasswordInput
#     )
#     password2 = forms.CharField(
#         label='confirm password',
#         widget=forms.PasswordInput
#     )
#     # premium = forms.BooleanField(required=False)
#
#     def clean_username(self):
#         username = self.cleaned_data.get('username')
#         qs = User.objects.filter(username=username)
#         if qs.exists():
#             raise forms.ValidationError("username exists")
#
#     def clean_email(self):
#         email = self.cleaned_data.get("email")
#         qs = User.objects.filter(email=email)
#         if qs.exists():
#             raise forms.ValidationError("email exists")
#
#     # def clean_premium(self):
#     #     premium = self.cleaned_data.get("premium")
#     #     if premium == 'on':
#     #         premium = True
#     #     else:
#     #         premium = False
#
#     def clean(self):
#         data = self.cleaned_data
#         #print("data is "+data)
#         password = self.cleaned_data.get("password")
#         password2 = self.cleaned_data.get('password2')
#         #premium = self.cleaned_data.get("premium")
#         # if premium == 'on':
#         #     premium = True
#         # else:
#         #     premium = False
#         if password != password2:
#             raise forms.ValidationError("pwds should match")
#         return data
