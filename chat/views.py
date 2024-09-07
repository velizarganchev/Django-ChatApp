from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.core import serializers
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

from chat.models import Chat, Message

@login_required(login_url="/login/")
def index(request):
    myChat = Chat.objects.get(id=1)
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

    return render(request, "chat/index.html", {"messages": chatMessages})


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
