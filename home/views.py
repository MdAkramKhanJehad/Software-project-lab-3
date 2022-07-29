from django.shortcuts import render
from login.models import NewUser

# Create your views here.

def home(request):
    
    if request.method == "POST":
        email = request.POST.get('email')
        new_user = NewUser(email=email)
        new_user.save()

        print("Inside home inside if")

    print("Inside home out")

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
