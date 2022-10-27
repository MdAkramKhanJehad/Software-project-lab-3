from django.shortcuts import render, redirect
from home.models import *
import json
import os
import environ
from spl_3 import settings
from home.methods import get_created_routine_from_session, get_selected_devices_from_session, get_environmental_variable, get_execution_indicators_from_session, get_relevant_devices_from_session, get_final_json_for_database, delete_all_the_sessions
from datetime import datetime

env = environ.Env()
environ.Env.read_env()


def home(request):
    # del request.session["selected_devices"]
    # request.session.modified = True
    # del request.session["created_routines"]
    # request.session.modified = True
    # del request.session["execution_indicators"]
    # request.session.modified = True
    # del request.session["relevant_device_list"]
    # request.session.modified = True
    # all_users = NewUser.objects.all().filter(user_id=request.POST.get('user_id'))
    # print("INSIDE HOME 1:",  datetime.now().strftime("%H:%M:%S"))
    if request.method == "POST":
        # if  len(all_users) < 1:
        #     user_id = request.POST.get('user_id')
        #     new_user = NewUser(user_id=user_id)
        #     new_user.save()
        delete_all_the_sessions(request)
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
    
    if request.GET.get('query'):
    
    # if request.method == 'POST':
        # print("Current Time in edit routine 1 =", datetime.now().strftime("%H:%M:%S"))
        
        # response_json = request.POST
        # response_json = json.dumps(response_json)
        # data = json.loads(response_json)
        
        # print("***DATA****: ", data)
        
        query = request.GET.get('query')
        query = query.replace(" ", " ")
        searchType = request.GET.get('search-type')
        searchType = searchType.replace(" ", " ")
        
        print("-------------Search USER ID :", query, type(query), " | ", searchType)

        search_result = None
        
        if searchType == "Search by User Id":  
            search_result = Routine.objects.filter(routine__user_id=query)
        else:   
            query = query.title()
            search_result = Routine.objects.filter(routine__created_routines__contains={"action_relevant_device":query}) | Routine.objects.filter(routine__created_routines__contains={"trigger_relevant_device":query}) 
        
        print("------------------Search Result####:", search_result)
        
        created_routines = []
        
        for result in search_result:
            for single_routine in result.routine["created_routines"]:
                if searchType == "Search by User Id":
                    created_routines.append({"trigger":single_routine["trigger"], "action": single_routine["action"]})
                else:
                    if single_routine["trigger_relevant_device"] == query or single_routine["action_relevant_device"] == query:
                        created_routines.append({"trigger":single_routine["trigger"], "action": single_routine["action"]})
        
        print(created_routines)
        
        context = {
            'created_routines': created_routines,
            'user_id': query
        }
        
        return render(request, 'home/search/search.html', context)
    else:
        return render(request, 'home/search/search.html')



def tutorial(request):
    if "current_user_id" not in request.session:
        return redirect('login')
    return render(request, 'home/tutorial/tutorial.html')


def select_device(request):
    selected_device_list = []
    
    request.session["current_page"] = "select_device"
    
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
    device_list = DeviceData.objects.all()

    if len(device_list) == 0:
        f = open(os.path.join(settings.STATIC_ROOT, 'data/device_data_updated.json'))
        data = json.load(f)

        # print("data/device_data.json:",data)
    
    
        for item in data:
            # print("device: ", list(item.keys())[0])
            # print("category: ", item[current_device_name][0][list(item[current_device_name][0].keys())[0]])
            current_device_name = list(item.keys())[0]
            new_device = DeviceData(device_name=current_device_name, category=item[current_device_name][0][list(item[current_device_name][0].keys())[0]])
            new_device.save()

            for attr in item[current_device_name][1][list(item[current_device_name][1].keys())[0]]:
                new_attribute = DeviceAttributeData(attribute=list(attr.keys())[0], action=attr[list(attr.keys())[0]], description=attr[list(attr.keys())[1]], device=new_device)
                # print("NEW***:", new_attribute.action)
                new_attribute.save()

        print("device data inserted")

    appliances_devices = DeviceData.objects.all().filter(category="Appliances")
    kitchen_and_cleaning_devices = DeviceData.objects.all().filter(category="Kitchen & Cleaning")
    security_and_safety = DeviceData.objects.all().filter(category="Security & Safety")
    multimedia = DeviceData.objects.all().filter(category="Multimedia")
    health = DeviceData.objects.all().filter(category="Health")
    lights_and_switches = DeviceData.objects.all().filter(category="Lights & Switches")
    gardening_devices = DeviceData.objects.all().filter(category="Gardening Devices")
    sensors_devices = DeviceData.objects.all().filter(category="Sensors")
    others_devices = DeviceData.objects.all().filter(category="Others")

    health_multimedia = health | multimedia

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
    relevant_devices_list = get_relevant_devices_from_session(request, 2)
    environmental_variable = get_environmental_variable()
    deviceAttributeList = []
    created_routines_list = []
    
    # get and save session after next button clicking 
    if request.method == 'POST':

        print("Current Time 0 =", datetime.now().strftime("%H:%M:%S"))
        response_json = request.POST
        response_json = json.dumps(response_json)
        data = json.loads(response_json)

        # print("CR data:", data["devices[0]"], " \n\nkeys:", data.keys())
        print("Current Time 1 =", datetime.now().strftime("%H:%M:%S"))
        
        new_relevant_device_list_temp = data["devices[0]"].split(",")
        new_relevant_device_list = []
        
        for i in range(int(len(new_relevant_device_list_temp))):
            if i%2 == 0:
                new_relevant_device_list.append([new_relevant_device_list_temp[i],new_relevant_device_list_temp[i+1]])
        
        print("******", len(new_relevant_device_list), "   | ", type(new_relevant_device_list))
        print("NEW ******** REL DEV:", new_relevant_device_list)
        
        # print("new_relevant_device_list:", new_relevant_device_list)
        print("Current Time 2 =", datetime.now().strftime("%H:%M:%S"))
        
        request.session["relevant_device_list"] = new_relevant_device_list
        # if len(new_relevant_device_list) > 0 and len(new_relevant_device_list[0]) > 1:
            
        #     request.session["relevant_device_list"] = new_relevant_device_list
            
            # if request.session.get("relevant_device_list"):
            #     print("Current Time 3 =", datetime.now().strftime("%H:%M:%S"))
            #     relevant_device_list = request.session["relevant_device_list"]
                
            #     # dont need the addition in future
            #     # relevant_device_list = relevant_device_list + new_relevant_device_list
                
            #     print("Current Time 4 =", datetime.now().strftime("%H:%M:%S"))
            #     request.session["relevant_device_list"] = relevant_device_list
                
            #     print("Current Time 5 =", datetime.now().strftime("%H:%M:%S"))
            #     # print("********Current relevant device list 111:", relevant_device_list)
                
            # else:
            #     print("Current Time 6 =", datetime.now().strftime("%H:%M:%S"))
            #     request.session["relevant_device_list"] = new_relevant_device_list
                
            #     print("Current Time 7 =", datetime.now().strftime("%H:%M:%S"))
            #     # print("********Current relevant device list 222:", new_relevant_device_list)
                
                
        for i in range(int(len(data)/2)):
            created_routines_list.append([data["routines[{}][trigger]".format(i)], data["routines[{}][action]".format(i)]])
        print("CREATED ROUTINES*******:", len(created_routines_list), " | ", created_routines_list )
        request.session["created_routines"] = created_routines_list
        request.session.modified = True
        
        # del request.session["created_routines"]
        # request.session.modified = True
        
    # get previously created routines, if available in session
    created_routines_list = get_created_routine_from_session(request, 2)
    
    
    # request data from 2 table for those device
    if len(selected_device_list) > 0:
        deviceAttributeList = []
        
        for device in selected_device_list:
            attrDesc = {}
            current_device = DeviceData.objects.get(device_name=device)
            # attributeDescriptionFromDb = DeviceAttributeData.objects.filter(device__device_name__contains=device)
            attributeDescriptionFromDb = DeviceAttributeData.objects.filter(device=current_device)
            # print("BEFORE:: type:", type(attributeDescriptionFromDb), " | VAL:", attributeDescriptionFromDb)
            attributeDescriptionFromDb = list(attributeDescriptionFromDb)
            
            counter = 0
            for a in attributeDescriptionFromDb:
                # if device == "Valve":
                #     print("****VALVE***", a.attribute)
                attrOfSingle = []
                attrOfSingle.append(a.attribute)
                attrOfSingle.append(a.action)
                attrOfSingle.append(a.description)
                attributeDescriptionFromDb[counter] = attrOfSingle
                
                counter += 1
                
            deviceAttributeList.append(attributeDescriptionFromDb)
        
    context = { 
        'previously_selected_devices': selected_device_list,
        'environmental_variables': environmental_variable,
        'selected_devices_attributes': deviceAttributeList,
        'relevant_devices_list' : relevant_devices_list,
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
                # print("relevant_device_list in Edit:", request.session["relevant_device_list"])
            
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
        # print("inside post: ", execution_indicators_list)
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
    if request.session["current_page"] == "complete":
        return redirect("home")
        
    relevant_devices_list = get_relevant_devices_from_session(request, 5)
    created_routines_list = get_created_routine_from_session(request, 5)
    selected_devices_list = get_selected_devices_from_session(request, 5)
    execution_indicators_list = get_execution_indicators_from_session(request, 5)
    
    # print("inside conf: ", execution_indicators_list)
    
    if len(selected_devices_list) == 0:
        return redirect('select_device')
    elif len(created_routines_list) == 0 or len(relevant_devices_list) == 0:
        return redirect('create_routine')
    elif len(execution_indicators_list) == 0:
        return redirect('create_execution_indicators')
    
    request.session["current_page"] = "confirmation"
    
    current_user_id = request.session["current_user_id"]
    
    if request.method == 'POST':
        final_json = get_final_json_for_database(current_user_id, relevant_devices_list, created_routines_list, execution_indicators_list)
        
        # try:
        #     connect_string = "mongodb+srv://genrout_routine_database:i59nQ7WWbHvMFyjX@routine.wjgsswb.mongodb.net/?retryWrites=true&w=majority"
        #     my_client = pymongo.MongoClient(connect_string)
        #     db = env("DATABASE_NAME")
        #     cl_name = env("ROUTINE_COLLECTION_NAME")
        #     dbname = my_client[db]
        #     collection_name  = dbname[cl_name]
        #     collection_name.insert_one(final_json)
        # finally:
        #     my_client.close()
            
        new_routine = Routine(routine=final_json)
        new_routine.save()

        delete_all_the_sessions(request)
        
        # print("INSIDE confirmation: final json:", final_json)
    
    unique_relevant_devices = []
    for devices in relevant_devices_list:
        for device in devices:
            unique_relevant_devices.append(device)
    
    unique_relevant_devices = list(set(unique_relevant_devices))
    
    context = { 
        'relevant_devices_list' : unique_relevant_devices, 
        'created_routines_list' : zip(created_routines_list, execution_indicators_list),  
        'page': 5 
    }

    return render(request, 'home/create/confirmation.html', context)


def complete(request):
    # if "execution_indicators" not in request.session:
    # if request.session["current_page"] != "confirmation" or request.session["current_page"] != "complete":
        # print("inside not confirmation")
        # if "selected_devices" not in request.session:
        #     return redirect('select_device')
        # elif "created_routines" not in request.session:
        #     return redirect('create_routine')
        # elif "execution_indicators" not in request.session:
        #     return redirect('create_execution_indicators')
        # else:
        #     print(request.session["created_routines"], " r| ", request.session["execution_indicators"])
        #     return redirect('confirmation')
        # return redirect('create_execution_indicators')
    
    request.session["current_page"] = "complete"
    delete_all_the_sessions(request)
    
    return render(request, 'home/complete/complete.html')
