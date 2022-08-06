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
    
    device_list = Device.objects.all()

    if len(device_list) == 0:
        f = open(os.path.join(settings.STATIC_ROOT, 'data/device_data.json'))
        data = json.load(f)
    
        for item in data:
            current_device_name = list(item.keys())[0]
            new_device = Device(device_name=current_device_name, category=item[current_device_name][0][list(item[current_device_name][0].keys())[0]])
            new_device.save()

            for attr in item[current_device_name][1][list(item[current_device_name][1].keys())[0]]:
                new_attribute = DeviceAttribute(attribute=list(attr.keys())[0], action=attr[list(attr.keys())[0]], description=attr[list(attr.keys())[1]], device=new_device)
                new_attribute.save()
    

    appliances_devices = Device.objects.all().filter(category="Appliances")
    kitchen_and_cleaning_devices = Device.objects.all().filter(category="Kitchen & Cleaning")
    safety_and_multimedia_devices = Device.objects.all().filter(category="Safety & Multimedia")
    sensors_devices = Device.objects.all().filter(category="Sensors")
    others_devices = Device.objects.all().filter(category="Others")

    # print(len(appliances_devices), " || ", len(kitchen_and_cleaning_devices), " || ", len(safety_and_multimedia_devices), " || ", len(sensors_devices), " || ", len(others_devices), " || ")
    # print("Total: ", len(appliances_devices) + len(kitchen_and_cleaning_devices) + len(safety_and_multimedia_devices) + len(sensors_devices) + len(others_devices))
    # print(others_devices[0].device_name, " || ", others_devices[0].id, " || ", others_devices[0].category)

    context = {
        'appliances_devices': appliances_devices,
        'kitchen_and_cleaning_devices': kitchen_and_cleaning_devices,
        'safety_and_multimedia_devices': safety_and_multimedia_devices,
        'sensors_devices': sensors_devices,
        'others_devices': others_devices,
    }

    return render(request, 'home/create/select_device.html', context)


def create_routine(request):
    return render(request, 'home/create/create_routine.html')


def create_execution_indication(request):
    return render(request, 'home/create/create_execution_indicator.html')


def confirmation(request):
    return render(request, 'home/confirmation/confirmation.html')


def complete(request):
    return render(request, 'home/complete/complete.html')
