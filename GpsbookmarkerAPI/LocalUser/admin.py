# Register your models here.


from django.contrib import admin
from .models import LocalUser, UserProfile, GmailAccount
# Register your models here.
admin.site.register(LocalUser)
admin.site.register(UserProfile)
admin.site.register(GmailAccount)




# THE FOLLOWING IS IMPORTANT IF YOU HAVE EXTENDED THE DJANGO BUILTIN USER TABLE!!
# earlier it was written as admin.site.register(LocalUser) which was not registering the user
# class CustomUserAdmin(UserAdmin):
#     #add_form = CustomUserCreationForm
#     form = CustomUserChangeForm
#     # model = LocalUser
#     # list_display = ['premium', ]
#     fieldsets = UserAdmin.fieldsets + (
#         (None, {
#             'fields': ('premium', )
#         }),
#       )
#
#     add_fieldsets = UserAdmin.add_fieldsets + (
#         (None, {
#             'fields': ('premium', )
#         }),
#       )
#
#
# admin.site.register(LocalUser, CustomUserAdmin)
