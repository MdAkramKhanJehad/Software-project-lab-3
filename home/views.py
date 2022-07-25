from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'home.html')

def search(request):
    return render(request, 'search.html')

def tutorial(request):
    return render(request, 'tutorial.html')

def device_list(request):
    return render(request, 'device_list.html')

def create_routine(request):
    return render(request, 'create_routine.html')

def confirmation(request):
    return render(request, 'confirmation.html')

def complete(request):
    return render(request, 'complete.html')
