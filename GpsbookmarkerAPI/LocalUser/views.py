# from django.shortcuts import render, redirect
# from django.contrib.auth import authenticate, login, get_user_model
# from .forms import RegisterFrom
# from  .models import LocalUser
#
# User = get_user_model()
#
# def register_page(request):
#     form = RegisterFrom(request.POST or None)
#     context = {
#         'form': form
#     }
#
#     if form.is_valid():
#         print(form.cleaned_data)
#         print("now we will start")
#         username = form.cleaned_data.get('username')
#         password = form.cleaned_data.get('password')
#         password2 = form.cleaned_data.get('password2')
#         email = form.cleaned_data.get('email')
#         print("emial is "+email)
#         #premium = form.cleaned_data.get('premium')
#         #print("Premium is" +premium)
#         new_user = User.objects.create(username, email, password)
#         print(new_user)
#     return render(request, 'registration.html', context)
