from django.shortcuts import render
from login.models import NewUser

# Create your views here.

def home(request):
    
    all_users = NewUser.objects.all().filter(email=request.POST.get('email'))

    if request.method == "POST" and len(all_users) < 1:
        email = request.POST.get('email')
        new_user = NewUser(email=email)
        new_user.save()

        print("A new user added")
    elif request.method == "POST":
        print("USER available: ", all_users[0].id, " || ", all_users[0].email)
    
    else:
        print("inside else")

    return render(request, 'home/home.html')


def search(request):
    return render(request, 'home/search/search.html')


def tutorial(request):
    return render(request, 'home/tutorial/tutorial.html')


def select_device(request):
    return render(request, 'home/create/select_device.html')


def create_routine(request):
    return render(request, 'home/create/create_routine.html')


def create_execution_indication(request):
    return render(request, 'home/create/create_execution_indicator.html')


def confirmation(request):
    return render(request, 'home/confirmation/confirmation.html')


def complete(request):
    return render(request, 'home/complete/complete.html')
