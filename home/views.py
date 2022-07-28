from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'home/home.html')

def search(request):
    return render(request, 'home/search/search.html')

def tutorial(request):
    return render(request, 'home/tutorial/tutorial.html')

def device_list(request):
    return render(request, 'home/create/device_list.html')

def create_routine(request):
    return render(request, 'home/create/create_routine.html')

def confirmation(request):
    return render(request, 'home/confirmation/confirmation.html')

def complete(request):
    return render(request, 'home/complete/complete.html')
