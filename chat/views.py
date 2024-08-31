from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth import authenticate, login

from chat.models import Chat, Message

# Create your views here.


def index(request):
    myChat = Chat.objects.get(id=1)
    chatMessages = Message.objects.filter(chat=myChat)

    if request.method == 'POST':
        text_message = request.POST['textmassage']
        if text_message:
            print('Received data:', text_message)
            Message.objects.create(
                text=text_message,
                chat=myChat,
                author=request.user,
                receiver=request.user
            )
            chatMessages = Message.objects.filter(chat=myChat)

    return render(request, 'chat/index.html', {'messages': chatMessages})


def login_view(request):
    if request.method == 'POST':
        user = authenticate(username=request.POST.get(
            'username'), password=request.POST.get('password'))
        if (user):
            login(request, user)
            return HttpResponseRedirect('/chat/')
        else:
            return render(request, 'auth/login.html', {'wrongPassword': True})
    return render(request, 'auth/login.html')
