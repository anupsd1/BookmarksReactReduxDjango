from django.contrib import admin
from .models import LocalUser
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserChangeForm
from .models import LocalUser

# Register your models here.
#earlier it was written as admin.site.register(LocalUser) which was not registering the user
class CustomUserAdmin(UserAdmin):
    #add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    # model = LocalUser
    # list_display = ['premium', ]
    fieldsets = UserAdmin.fieldsets + (
        (None, {
            'fields': ('premium', )
        }),
      )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {
            'fields': ('premium', )
        }),
      )


admin.site.register(LocalUser, CustomUserAdmin)
