from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, EmployeeProfile, Device, Guest, AccessLog, Message
from .forms import CustomUserCreationForm

# Extend the default UserAdmin to show custom fields
class UserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm

    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {'fields': ('role', 'must_change_password')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'role', 'must_change_password'),  # Removed password1 and password2
        }),
    )

    list_display = ['username', 'email', 'role', 'is_active', 'is_staff', 'is_superuser', 'must_change_password']
    list_filter = ['role', 'is_active']
    search_fields = ['username', 'email']

    


# Register User using the custom admin
admin.site.register(User, UserAdmin)

@admin.register(EmployeeProfile)
class EmployeeProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'full_name', 'department', 'position', 'staff_id', 'id_qr_code', 'profile_picture', 'date_registered']
    search_fields = ['full_name', 'department', 'staff_id']

@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ['device_name', 'owner_employee', 'owner_guest',  'serial_number', 'qr_code', 'is_verified']
    search_fields = ['device_name', 'serial_number']
    list_filter = ['is_verified']

@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'phone', 'purpose', 'invited_by', 'token', 'visit_date', 'is_verified', ]
    search_fields = ['full_name', 'phone']
    list_filter = ['is_verified', 'visit_date']



@admin.register(AccessLog)
class AccessLogAdmin(admin.ModelAdmin):
    list_display = ['person_type', 'person_id', 'device_serial', 'scanned_by', 'time_in', 'time_out', 'status']
    list_filter = ['status', 'person_type', 'time_in']

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'sender', 'content', 'created_at']
    search_fields = ['content', 'sender__username']
    list_filter = ['created_at']

