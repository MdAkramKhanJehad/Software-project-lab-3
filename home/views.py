from django.shortcuts import render
from login.models import NewUser
from home.models import Device, DeviceAttribute
import json
import os
from spl_3 import settings
from home.methods import get_created_routine_from_session, get_selected_devices_from_session, get_environmental_variable

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
    
    # del request.session["created_routines"]
    # request.session.modified = True
    # del request.session["selected_devices"]
    # request.session.modified = True
    
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
        f = open(os.path.join(settings.STATIC_ROOT, 'data/device_data_updated.json'))
        data = json.load(f)

        # print("data/device_data.json:",data)
    
    
        for item in data:
            # print("device: ", list(item.keys())[0])
            # print("category: ", item[current_device_name][0][list(item[current_device_name][0].keys())[0]])
            current_device_name = list(item.keys())[0]
            new_device = Device(device_name=current_device_name, category=item[current_device_name][0][list(item[current_device_name][0].keys())[0]])
            new_device.save()

            for attr in item[current_device_name][1][list(item[current_device_name][1].keys())[0]]:
                new_attribute = DeviceAttribute(attribute=list(attr.keys())[0], action=attr[list(attr.keys())[0]], description=attr[list(attr.keys())[1]], device=new_device)
                new_attribute.save()

        print("device data inserted")

    appliances_devices = Device.objects.all().filter(category="Appliances")
    kitchen_and_cleaning_devices = Device.objects.all().filter(category="Kitchen & Cleaning")
    security_and_safety = Device.objects.all().filter(category="Security & Safety")
    multimedia = Device.objects.all().filter(category="Multimedia")
    health = Device.objects.all().filter(category="Health")
    lights_and_switches = Device.objects.all().filter(category="Lights & Switches")
    gardening_devices = Device.objects.all().filter(category="Gardening Devices")
    sensors_devices = Device.objects.all().filter(category="Sensors")
    others_devices = Device.objects.all().filter(category="Others")

    health_multimedia = health | multimedia

    print("Total: ", len(appliances_devices) , " ", len(kitchen_and_cleaning_devices), " ", len(security_and_safety) , " ", len(health) , len(multimedia))

    context = {
        'appliances_devices': appliances_devices,
        'kitchen_and_cleaning_devices': kitchen_and_cleaning_devices,
        'security_and_safety': security_and_safety,
        'health_and_multimedia': health_multimedia,
        'lights_and_switches': lights_and_switches,
        'gardening_devices': gardening_devices,
        'sensors_devices': sensors_devices,
        'others_devices': others_devices,
        'previously_selected_devices': selected_device_list,
        'page': 1
    }

    return render(request, 'home/create/select_device.html', context)


def create_routine(request):
    selected_device_list = get_selected_devices_from_session(request, 2)
    environmental_variable = get_environmental_variable()
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
    created_routines_list = get_created_routine_from_session(request, 2)
    
    
    # request data from 2 table for those device
    if len(selected_device_list) > 0:
        deviceAttributeList = []
        
        for device in selected_device_list:
            attrDesc = {}
            attributeDescriptionFromDb = DeviceAttribute.objects.filter(device__device_name__contains=device)
            # print("BEFORE:: type:", type(attributeDescriptionFromDb), " | VAL:", attributeDescriptionFromDb)
            attributeDescriptionFromDb = list(attributeDescriptionFromDb)
            
            counter = 0
            for a in attributeDescriptionFromDb:
                attrOfSingle = []
                attrOfSingle.append(a.attribute)
                attrOfSingle.append(a.action)
                attrOfSingle.append(a.description)
                # print("TYPE:", type(a.attribute))
                attributeDescriptionFromDb[counter] = attrOfSingle
                
                counter += 1
                
            deviceAttributeList.append(attributeDescriptionFromDb)
        
    context = { 
        'previously_selected_devices': selected_device_list,
        'environmental_variables': environmental_variable,
        'selected_devices_attributes': deviceAttributeList,
        'previously_created_routines' : created_routines_list,
        'page': 2 
    }

    return render(request, 'home/create/create_routine.html', context)


def edit_delete_routine(request):
    created_routines_list = []
    
    if request.method == 'POST':

        response_json = request.POST
        response_json = json.dumps(response_json)
        data = json.loads(response_json)

        # if data["name"] == "update":
        #     print("its update")
        # elif data["name"] == "delete":
        #     print("its delete")

        for i in range(int(len(data)/2)):
            created_routines_list.append([data["routines[{}][trigger]".format(i)], data["routines[{}][action]".format(i)]])

        request.session["created_routines"] = created_routines_list
        request.session.modified = True
        print("data from session page 3: ", request.session.get("created_routines") , end="\n\n")
    
    
    created_routines_list = get_created_routine_from_session(request, 3)
    
    context = { 
        'created_routines_list' : created_routines_list,       
        'page': 3 
    }

    return render(request, 'home/create/edit_or_delete_routine.html', context)



def create_execution_indication(request):
    created_routines_list = get_created_routine_from_session(request, 4)
    
    context = { 
        'created_routines_list' : created_routines_list,       
        'page': 4 
    }

    return render(request, 'home/create/execution_indicator.html', context)


def confirmation(request):
    created_routines_list = get_created_routine_from_session(request, 5)
    selected_devices_list = get_selected_devices_from_session(request, 5)
        
    context = { 
        'selected_devices_list' : selected_devices_list, 
        'created_routines_list' : created_routines_list,       
        'page': 5 
    }

    return render(request, 'home/create/confirmation.html', context)


def complete(request):
    return render(request, 'home/complete/complete.html')


