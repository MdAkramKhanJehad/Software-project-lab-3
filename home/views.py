from django.shortcuts import render, redirect
from login.models import NewUser
from home.models import Device, DeviceAttribute
import json
import os
import time
import pymongo
import environ
from spl_3 import settings
from home.methods import get_created_routine_from_session, get_selected_devices_from_session, get_environmental_variable, get_execution_indicators_from_session, get_relevant_devices_from_session
from datetime import datetime

env = environ.Env()
environ.Env.read_env()


def home(request):
    
    # all_users = NewUser.objects.all().filter(user_id=request.POST.get('user_id'))
    # print("INSIDE HOME 1:",  datetime.now().strftime("%H:%M:%S"))
    if request.method == "POST":
        # if  len(all_users) < 1:
        #     user_id = request.POST.get('user_id')
        #     new_user = NewUser(user_id=user_id)
        #     new_user.save()
        request.session["current_user_id"] = request.POST.get('user_id')
        # print("****CURRENT USER****: ", request.session["current_user_id"])
    
    # if request.session.get("current_page"):
    #     request.session["current_page"] = "complete"
    # print("INSIDE HOME 2:",  datetime.now().strftime("%H:%M:%S"))
    
    if "current_user_id" not in request.session:
        return redirect('login')
    # print("INSIDE HOME 3:",  datetime.now().strftime("%H:%M:%S"))
    
    print("****CURRENT USER****: ", request.session["current_user_id"])
    
    return render(request, 'home/home.html')


def search(request):
    return render(request, 'home/search/search.html')


def tutorial(request):
    return render(request, 'home/tutorial/tutorial.html')


def select_device(request):
    # print("Current Time 1 =", datetime.now().strftime("%H:%M:%S"))
    
    selected_device_list = []
    all_devices = []
    all_device_attributes = []
    
    
    # print("Current Time 2 =", datetime.now().strftime("%H:%M:%S"))
    
    # del request.session["all_devices"]
    # request.session.modified = True
    # del request.session["all_devices_attributes"]
    # request.session.modified = True
    # print("Current Time 3 =", datetime.now().strftime("%H:%M:%S"))
    # if request.session.get("all_devices"):
        
    if "all_devices" not in request.session and "all_devices_attributes" not in request.session:
        print("******NOT IN SESSION - GET FROM MONGO********")
        # print("Current Time 4 =", datetime.now().strftime("%H:%M:%S"))
        connect_string = "mongodb+srv://genrout_routine_database:i59nQ7WWbHvMFyjX@routine.wjgsswb.mongodb.net/?retryWrites=true&w=majority"
        my_client = pymongo.MongoClient(connect_string)
        db = env("DATABASE_NAME")
        cl_name = env("DEVICE_COLLECTION_NAME")
        dbname = my_client[db]
        collection_name  = dbname[cl_name]
        # count = collection_name.count()
        # print("********COLLECTION_COUNT FROM MONGODB:", count)
        
        device_details = collection_name.find({})
        # print("Current Time 5 =", datetime.now().strftime("%H:%M:%S"))
        
        for dev in device_details:
            device_and_attributes = {}
            single_device_attributes = []
            
            # print(type(dev))
            # print(dev)
            # print("Device name:", list(dev.keys())[1])
            # print("Device category: ", dev[list(dev.keys())[1]][0]['Category'])
            # print("Device attr: ", dev[list(dev.keys())[1]][1]['AttributesAndDescriptions'])
            
            new_device = Device(device_name=list(dev.keys())[1], category=dev[list(dev.keys())[1]][0]['Category'])
            all_devices.append(new_device.toJSON())
            device_and_attributes["device_name"] = list(dev.keys())[1]
            
            attrs = dev[list(dev.keys())[1]][1]['AttributesAndDescriptions']
            
            for devattr in attrs:
                # print("attr: ", list(devattr.keys())[0])
                # print("action: ", devattr[list(devattr.keys())[0]])
                # print("desc: ", devattr["desc"])
                
                single_attribute = [list(devattr.keys())[0], devattr[list(devattr.keys())[0]], devattr["desc"]]
                single_device_attributes.append(single_attribute)
                
            device_and_attributes["device_attributes"] = single_device_attributes
            all_device_attributes.append(device_and_attributes)
        
        # print("Current Time 6 after for loop =", datetime.now().strftime("%H:%M:%S"))
        # print("All device length:", len(all_devices), " | dev attr length:", len(all_device_attributes) )
        
        request.session["all_devices"] = all_devices
        request.session["all_devices_attributes"] = all_device_attributes
        # print("Current Time 7 after for loop =", datetime.now().strftime("%H:%M:%S"))
    else:
        # print("Current Time 3.5 =", datetime.now().strftime("%H:%M:%S"))
        all_devices = request.session["all_devices"]
        # print("Current Time 4 =", datetime.now().strftime("%H:%M:%S"))
        print("******GOT IN SESSION********")
    
    # print("*************Session in seldev:", request.session["all_devices_attributes"] )   
    request.session["current_page"] = "select_device"
    
    # del request.session["created_routines"]
    # request.session.modified = True
    # del request.session["selected_devices"]
    # request.session.modified = True
    
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
       
   
    # print(all_devices[0])
    appliances_devices = [json.loads(x) for x in all_devices if json.loads(x)["category"] == "Appliances"] 
    kitchen_and_cleaning_devices = [json.loads(x) for x in all_devices if json.loads(x)["category"] == "Kitchen & Cleaning"]
    security_and_safety = [json.loads(x) for x in all_devices if json.loads(x)["category"] == "Security & Safety"]
    multimedia = [json.loads(x) for x in all_devices if json.loads(x)["category"] == "Multimedia"]
    health = [json.loads(x) for x in all_devices if json.loads(x)["category"] == "Health"]
    lights_and_switches = [json.loads(x) for x in all_devices if json.loads(x)["category"] == "Lights & Switches"]
    gardening_devices = [json.loads(x) for x in all_devices if json.loads(x)["category"] == "Gardening Devices"]
    sensors_devices = [json.loads(x) for x in all_devices if json.loads(x)["category"] == "Sensors"]
    others_devices = [json.loads(x) for x in all_devices if json.loads(x)["category"] == "Others"]

    # print("TYPE: ", type(health), " | ", type(multimedia))
    health_multimedia = health + multimedia
    # print("Total: ", len(appliances_devices) , " ", len(kitchen_and_cleaning_devices), " ", len(security_and_safety) , " ", len(health) , len(multimedia))

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
    if "selected_devices" not in request.session:
        return redirect('select_device')
    
    request.session["current_page"] = "create_routine"
     
    selected_device_list = get_selected_devices_from_session(request, 2)
    environmental_variable = get_environmental_variable()
    deviceAttributeList = []
    created_routines_list = []
    new_relevant_device_list = []
    relevant_device_list = []
    
    # if request.session.get("relevant_device_list"):
    #     del request.session["relevant_device_list"]
    #     del request.session["created_routines"]
        # request.session.modified = True
    #     print("session deletedddd")
    # get and save session after next button clicking 
    if request.method == 'POST':
        print("Current Time 0 =", datetime.now().strftime("%H:%M:%S"))
        response_json = request.POST
        response_json = json.dumps(response_json)
        data = json.loads(response_json)

        # print("CR data:", data["devices[0]"], " \n\nkeys:", data.keys())
        print("Current Time 1 =", datetime.now().strftime("%H:%M:%S"))
        
        new_relevant_device_list = data["devices[0]"].split(",")
        
        print("new_relevant_device_list:", new_relevant_device_list)
        print("Current Time 2 =", datetime.now().strftime("%H:%M:%S"))
        if len(new_relevant_device_list) > 0 and len(new_relevant_device_list[0]) > 1:
            if request.session.get("relevant_device_list"):
                print("Current Time 3 =", datetime.now().strftime("%H:%M:%S"))
                relevant_device_list = request.session["relevant_device_list"]
                relevant_device_list = relevant_device_list + new_relevant_device_list
                
                print("Current Time 4 =", datetime.now().strftime("%H:%M:%S"))
                request.session["relevant_device_list"] = relevant_device_list
                
                print("Current Time 5 =", datetime.now().strftime("%H:%M:%S"))
                print("********Current relevant device list 111:", relevant_device_list)
                
            else:
                print("Current Time 6 =", datetime.now().strftime("%H:%M:%S"))
                request.session["relevant_device_list"] = new_relevant_device_list
                
                print("Current Time 7 =", datetime.now().strftime("%H:%M:%S"))
                print("********Current relevant device list 222:", new_relevant_device_list)
                
                
        for i in range(int(len(data)/2)):
            created_routines_list.append([data["routines[{}][trigger]".format(i)], data["routines[{}][action]".format(i)]])
        print("CREATED ROUTINES*******:", len(created_routines_list), " | ", created_routines_list )
        request.session["created_routines"] = created_routines_list
        request.session.modified = True
        # print("data from session page 2: ", request.session.get("created_routines") , end="\n\n")
        
        # del request.session["created_routines"]
        # request.session.modified = True
        
    # get previously created routines, if available in session
    created_routines_list = get_created_routine_from_session(request, 2)
    
    # request data from 2 table for those device
    if len(selected_device_list) > 0:
        deviceAttributeList = []
        
        # print("Current Time in create routine 1 =", datetime.now().strftime("%H:%M:%S"))
        attrList = request.session["all_devices_attributes"]
        # print("Current Time in create routine 2 =", datetime.now().strftime("%H:%M:%S"))
        # print("TYPE:", type(attrList), " | ", attrList)
        
        
        for selDev in selected_device_list:
            for devAttrItem in attrList:
                if devAttrItem['device_name'] == selDev:
                    deviceAttributeList.append(devAttrItem["device_attributes"])
        
        # selected_devices_attributes = [x for x in attrList if x["device_name"] in selected_device_list]
        # print("Current Time in create routine 3 =", datetime.now().strftime("%H:%M:%S"))
        # print("Len:", len(selected_devices_attributes))
                
        # for device_attribute in selected_devices_attributes:
        #     deviceAttributeList.append(device_attribute["device_attributes"])
            
        # print("Current Time in create routine 4 =", datetime.now().strftime("%H:%M:%S"))        
    # print("*************sel dev attr:", type(deviceAttributeList) )    
    
    context = { 
        'previously_selected_devices': selected_device_list,
        'environmental_variables': environmental_variable,
        'selected_devices_attributes': deviceAttributeList,
        'previously_created_routines' : created_routines_list,
        'page': 2 
    }

    return render(request, 'home/create/create_routine.html', context)


def edit_delete_routine(request):
    # print("Current Time in edit routine 1 =", datetime.now().strftime("%H:%M:%S"))        
    sel_devices = get_selected_devices_from_session(request, 3)
    # print("Current Time in edit routine 2 =", datetime.now().strftime("%H:%M:%S"))
    cre_routines = get_created_routine_from_session(request, 3)
    # print("Current Time in edit routine 3 =", datetime.now().strftime("%H:%M:%S"))
    
    if request.session.get("selected_devices") == 0:
        return redirect('select_device')
    elif len(cre_routines) == 0:
        return redirect('create_routine')
    
    # print("Current Time in edit routine 4 =", datetime.now().strftime("%H:%M:%S"))
    
    request.session["current_page"] = "edit_delete_routine"
    created_routines_list = []
    
    # print("Current Time in edit routine 5 =", datetime.now().strftime("%H:%M:%S"))
    if request.method == 'POST':
        # print("Current Time in edit routine 1 =", datetime.now().strftime("%H:%M:%S"))
        
        response_json = request.POST
        response_json = json.dumps(response_json)
        data = json.loads(response_json)
        # print("Current Time in edit routine 2 =", datetime.now().strftime("%H:%M:%S"))
        
        for i in range(int(len(data)/2) - 1):
            created_routines_list.append([data["routines[{}][trigger]".format(i)], data["routines[{}][action]".format(i)]])
        
        # print("Current Time in edit routine 3 =", datetime.now().strftime("%H:%M:%S"))
        
        if data["name"] == "delete":
            if request.session.get("execution_indicators"):
                # print("Current Time in edit routine 4 =", datetime.now().strftime("%H:%M:%S"))
                indexOfDeletedRoutine = int(data["index_number"])
                execution_indicators_list = request.session["execution_indicators"]
                # print("Current Time in edit routine 5 =", datetime.now().strftime("%H:%M:%S"))
                execution_indicators_list = execution_indicators_list[:indexOfDeletedRoutine] + execution_indicators_list[indexOfDeletedRoutine+1 :]
                # print("LENGTH OF ROUS: ", len(execution_indicators_list))
                # print("Current Time in edit routine 6 =", datetime.now().strftime("%H:%M:%S"))
                request.session["execution_indicators"] = execution_indicators_list
                # print("Current Time in edit routine 7 =", datetime.now().strftime("%H:%M:%S"))
                request.session.modified = True
                # print("Current Time in edit routine 8 =", datetime.now().strftime("%H:%M:%S"))
            
            if request.session.get("relevant_device_list"):
                # print("Current Time in edit routine 4 =", datetime.now().strftime("%H:%M:%S"))
                indexOfDeletedRoutine = int(data["index_number"])
                relevant_device_list = request.session["relevant_device_list"]
                # print("Current Time in edit routine 5 =", datetime.now().strftime("%H:%M:%S"))
                relevant_device_list = relevant_device_list[:indexOfDeletedRoutine] + relevant_device_list[indexOfDeletedRoutine+1 :]
                # print("Current Time in edit routine 6 =", datetime.now().strftime("%H:%M:%S"))
                request.session["relevant_device_list"] = relevant_device_list
                # print("Current Time in edit routine 7 =", datetime.now().strftime("%H:%M:%S"))
                request.session.modified = True
                print("relevant_device_list in Edit:", request.session["relevant_device_list"])
            
        # print("Current Time in edit routine 9 =", datetime.now().strftime("%H:%M:%S"))
        request.session["created_routines"] = created_routines_list
        request.session.modified = True
        # print("data from session page 10: ", request.session.get("created_routines") , end="\n\n")
    
    # print("Current Time in edit routine 6 =", datetime.now().strftime("%H:%M:%S"))
    created_routines_list = get_created_routine_from_session(request, 3)
    # print("Current Time in edit routine 7 =", datetime.now().strftime("%H:%M:%S"))
    context = { 
        'created_routines_list' : created_routines_list,       
        'page': 3 
    }

    return render(request, 'home/create/edit_or_delete_routine.html', context)



def create_execution_indication(request):
    execution_indicators_list = []
    relevant_device_list = []
    created_routines_list = get_created_routine_from_session(request, 4)
    selected_devices_list = get_selected_devices_from_session(request, 4)
    
    if len(selected_devices_list) == 0:
        return redirect('select_device')
    elif len(created_routines_list) == 0:
        return redirect('create_routine')
    
    request.session["current_page"] = "create_execution_indication"
    
    # print("inside create ei:", len(created_routines_list))

    # if request.session.get("execution_indicators"):
    #     del request.session["execution_indicators"]
    #     request.session.modified = True
    
    if request.method == 'POST':
        response_json = request.POST
        response_json = json.dumps(response_json)
        data = json.loads(response_json)
        
        for i in range(int(len(data)/5)):
            # print("EI data:", data["execution_indicators[{}][]".format(i)])
            execution_indicators_list.append([data["execution_indicators[{}][0]".format(i)], data["execution_indicators[{}][1]".format(i)], 
                                              data["execution_indicators[{}][2]".format(i)], data["execution_indicators[{}][3]".format(i)], 
                                              data["execution_indicators[{}][4]".format(i)]])

        # print("EI List: ", len(execution_indicators_list), " | ", execution_indicators_list)
        print("inside post: ", execution_indicators_list)
        request.session["execution_indicators"] = execution_indicators_list
        request.session.save()
        request.session.modified = True
        # print("ei data from session page 4 inside if: ", request.session.get("execution_indicators") , end="\n\n")
    
    if request.session.get("execution_indicators"):
        execution_indicators_list = request.session["execution_indicators"]    

    if request.session.get("relevant_device_list"):
        relevant_device_list = request.session["relevant_device_list"]
    # print("ei from session page 4 out post: ", execution_indicators_list , end="\n\n")
        
    context = { 
        'routines_and_relevant_device_list' : zip(created_routines_list, relevant_device_list),
        'execution_indicators_list' : execution_indicators_list, 
        'created_routines_list' : created_routines_list,      
        'page': 4 
    }

    return render(request, 'home/create/execution_indicator.html', context)


def confirmation(request):
    relevant_devices_list = get_relevant_devices_from_session(request, 5)
    created_routines_list = get_created_routine_from_session(request, 5)
    selected_devices_list = get_selected_devices_from_session(request, 5)
    execution_indicators_list = get_execution_indicators_from_session(request, 5)
    
    print("inside conf: ", execution_indicators_list)
    
    if len(selected_devices_list) == 0:
        return redirect('select_device')
    elif len(created_routines_list) == 0 or len(relevant_devices_list) == 0:
        return redirect('create_routine')
    elif len(execution_indicators_list) == 0:
        return redirect('create_execution_indicators')
    
    request.session["current_page"] = "confirmation"
    context = { 
        'relevant_devices_list' : relevant_devices_list, 
        'created_routines_list' : zip(created_routines_list, execution_indicators_list),  
        'page': 5 
    }

    return render(request, 'home/create/confirmation.html', context)


def complete(request):
    if request.session["current_page"] != "confirmation":
        print("inside not confirmation")
        if "selected_devices" not in request.session:
            return redirect('select_device')
        elif "created_routines" not in request.session:
            return redirect('create_routine')
        elif "execution_indicators" not in request.session:
            return redirect('create_execution_indicators')
        else:
            print(request.session["created_routines"], " r| ", request.session["execution_indicators"])
            return redirect('confirmation')
    
    request.session["current_page"] = "complete"
    
    return render(request, 'home/complete/complete.html')
