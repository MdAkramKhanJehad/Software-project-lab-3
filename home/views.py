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
    selected_device_list = []
    
    # get and save session after next button clicking
    if request.method == 'POST':

        response_json = request.POST
        response_json = json.dumps(response_json)
        data = json.loads(response_json)
        
        for i in range(len(data)):
            selected_device_list.append(data["devices[{}]".format(i)])
       
        request.session["selected_devices"] = selected_device_list
        request.session.modified = True
        # print("data from session page 1: ", request.session['selected_devices'] , end="\n\n")
        
        
    # get previously selected devices, if available in session
    if request.session.get("selected_devices"):
        selected_device_list = request.session["selected_devices"]
        # print("session available: ", selected_device_list ) 
    else:
        print("no session available")
       
       
    # get all device from db    
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

        print("device data inserted")

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
        'previously_selected_devices': selected_device_list,
        'page': 1
    }

    return render(request, 'home/create/select_device.html', context)


def create_routine(request):
    selected_device_list = []
    deviceAttributeList = []
    created_routines_list = []
    
    # get and save session after next button clicking 
    if request.method == 'POST':

        response_json = request.POST
        response_json = json.dumps(response_json)
        data = json.loads(response_json)

        for i in range(int(len(data)/2)):
            created_routines_list.append([data["routines[{}][trigger]".format(i)], data["routines[{}][action]".format(i)]])

        request.session["created_routines"] = created_routines_list
        request.session.modified = True
        print("data from session page 2: ", request.session.get("created_routines") , end="\n\n")
        
        # del request.session["created_routines"]
        # request.session.modified = True
        
    # get previously created routines, if available in session
    if request.session.get("created_routines"):
        created_routines_list = request.session["created_routines"]
        print("routine session available page 2: ", created_routines_list ) 
    else:
        print("*****no routine session available page 2*******")
    
    
    if request.session.get("selected_devices"):
        selected_device_list = request.session["selected_devices"]
        print("selected device session available page 2: ", selected_device_list , end="\n\n") 
    else:
        print("no device session available", end="\n\n")
    
    # request data from 2 table for those device
    if len(selected_device_list) > 0:
        deviceAttributeList = []
        
        for device in selected_device_list:
            attrDesc = {}
            attributeDescriptionFromDb = DeviceAttribute.objects.filter(device__device_name__contains=device)
            deviceAttributeList.append(attributeDescriptionFromDb)
                     
    context = { 
        'previously_selected_devices': selected_device_list,
        'selected_devices_attributes': deviceAttributeList,
        'previously_created_routines' : created_routines_list,
        'page': 2 
    }

    return render(request, 'home/create/create_routine.html', context)


def edit_delete_routine(request):
    created_routines_list = []
    
    if request.session.get("created_routines"):
        created_routines_list = request.session["created_routines"]
        print("routine session available page 3: ", created_routines_list ) 
    else:
        print("*****no routine session available page 3*******")
    
    context = { 
        'created_routines_list' : created_routines_list,       
        'page': 3 
    }

    return render(request, 'home/create/edit_or_delete_routine.html', context)



def create_execution_indication(request):
    created_routines_list = []
    
    if request.session.get("created_routines"):
        created_routines_list = request.session["created_routines"]
        print("routine session available page 4: ", created_routines_list ) 
    else:
        print("*****no routine session available page 4*******")
        
    context = { 
        'created_routines_list' : created_routines_list,       
        'page': 4 
    }

    return render(request, 'home/create/execution_indicator.html', context)


def confirmation(request):

    context = { 'page': 5 }

    return render(request, 'home/create/confirmation.html', context)


def complete(request):
    return render(request, 'home/complete/complete.html')
