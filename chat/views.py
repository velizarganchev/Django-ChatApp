import json
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.core import serializers
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

from chat.models import Chat, Message


@login_required(login_url="/login/")
def index(request):
    chats = Chat.objects.all()

    if request.method == "POST":
        chat_name = request.POST["chatname"]
        if chat_name:
            new_chat = Chat.objects.create(
                name=chat_name,
                creator=request.user
            )

            serialized_obj = serializers.serialize("json", [new_chat])

            serialized_data = json.loads(serialized_obj)[0]
            response_data = {
                'id': serialized_data['pk'],
                'name': serialized_data['fields']['name'],
                'creator': serialized_data['fields']['creator'],
                'created_at': serialized_data['fields']['created_at'],
            }
            return JsonResponse(response_data, safe=False)

        chats = Chat.objects.all()
    return render(request, "chat/index.html", {"chats": chats, "user": request.user})


def single_chat_view(request, chat_id):
    myChat = Chat.objects.get(id=chat_id)
    chatMessages = Message.objects.filter(chat=myChat)

    if request.method == "POST":
        text_message = request.POST["textmassage"]
        if text_message:
            new_message = Message.objects.create(
                text=text_message,
                chat=myChat,
                author=request.user,
                receiver=request.user,
            )
            serialized_obj = serializers.serialize(
                "json",
                [
                    new_message,
                ],
            )
            return JsonResponse(serialized_obj[1:-1], safe=False)

        chatMessages = Message.objects.filter(chat=myChat)

    return render(request, "chat/single_chat.html", {"messages": chatMessages, "chat": myChat, "chatId": chat_id, "chat_creator": myChat.creator})


def delete_chat(request, chat_id):
    chatToDelete = Chat.objects.get(id=chat_id)
    if request.method == "POST":
        if request.user == chatToDelete.creator:
            chatToDelete.delete()
        return HttpResponseRedirect("/chat/")


def register_view(request):
    if request.method == "POST":
        if request.POST.get("password") != request.POST.get("repeatPassword"):
            return render(request, "auth/register.html", {"unidentical": True})
        else:
            User.objects.create_user(
                request.POST.get("username"),
                request.POST.get("email"),
                request.POST.get("password"),
            )
            return HttpResponseRedirect("/login/")
    return render(request, "auth/register.html")


def login_view(request):
    redirect = request.GET.get("next")
    if request.method == "POST":
        user = authenticate(
            username=request.POST.get("username"), password=request.POST.get("password")
        )
        if user:
            login(request, user)
            if request.POST.get("redirect") != "None":
                return HttpResponseRedirect(request.POST.get("redirect"))
            else:
                return HttpResponseRedirect("/chat/")
        else:
            return render(
                request,
                "auth/login.html",
                {"wrongPassword": True, "redirect": redirect},
            )
    return render(request, "auth/login.html", {"redirect": redirect})


def logout_view(request):
    logout(request)
    return HttpResponseRedirect("/login/")
