from django.contrib import admin
from .models import Message
from .models import Chat


class MessageAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'author', 'text', 'chat', 'receiver')
    fields = ('text', 'chat', 'created_at', 'author', 'receiver',)
    search_fields = ('text',)

# Register your models here.


admin.site.register(Message, MessageAdmin)
admin.site.register(Chat)
