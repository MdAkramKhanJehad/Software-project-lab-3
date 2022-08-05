from django.shortcuts import render
from login.models import NewUser
from home.models import Device, DeviceAttribute
import json
import os
from spl_3 import settings

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
    # check whether availabe in db, first time db will be empty
    # if available, get data else first insert, then get data

    
    device_list = Device.objects.all()

    if len(device_list) == 0:
        f = open(os.path.join(settings.STATIC_ROOT, 'data/device_data.json'))
        data = json.load(f)
    
        for item in data:
            # print(item)
            device_name = list(item.keys())[0]

            print("device name: ", device_name)
            print("device cat: ", list(item[device_name][0].keys())[0], " : ", item[device_name][0][list(item[device_name][0].keys())[0]])
            for i in item[device_name]:
                if list(i.keys())[0] == "Category":
                    print(list(i.keys())[0], " ", i[list(i.keys())[0]])

                if list(i.keys())[0] == "AttributesAndDescriptions":
                    for attr in list(i.values())[0]:
                        print(list(attr.keys())[0], " : ", attr[list(attr.keys())[0]])
                        print(list(attr.keys())[1], " : ", attr[list(attr.keys())[1]])

            print('\n')

    return render(request, 'home/create/select_device.html')


def create_routine(request):
    return render(request, 'home/create/create_routine.html')


def create_execution_indication(request):
    return render(request, 'home/create/create_execution_indicator.html')


def confirmation(request):
    return render(request, 'home/confirmation/confirmation.html')


def complete(request):
    return render(request, 'home/complete/complete.html')
