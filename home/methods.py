def get_environmental_variable():
    all_env_vars = [['Time',"This factor can be used to associate routines with specific time of the day, week or month, to define frequency based on time (hourly, weekly) or set a timer."], ['Mode',"You can also set the mode of your smart home. For example, Home, Away, Vacation, Night, When Kids are present, etc."], ['External Factors',"Create routines based on external factors like weather, push/sms/email notifications, etc."], ['Device Placement',"Create routines based on where the devices are placed at your home."], ['Geographic Location',"Create routines based on geographic location of your house."]]
    return all_env_vars


def get_created_routine_from_session(request, pageNo):
    created_routines_list = []
    
    if request.session.get("created_routines"):
        created_routines_list = request.session["created_routines"]
        # print("routine session available page {}: ".format(pageNo), created_routines_list ) 
    else:
        print("*****no routine session available in page {}*******".format(pageNo))
    
    return created_routines_list
    
    
def get_selected_devices_from_session(request, pageNo):
    selected_device_list = []
    
    if request.session.get("selected_devices"):
        selected_device_list = request.session["selected_devices"]
        # print("selected device session available page {}: ".format(pageNo), selected_device_list , end="\n") 
    else:
        print("*****no device session available in page {}*******".format(pageNo), end="\n\n")
        
    return selected_device_list


def get_execution_indicators_from_session(request, pageNo):
    execution_indicators_list = []
    
    if request.session.get("execution_indicators"):
        execution_indicators_list = request.session["execution_indicators"]
        # print("selected ei available page {}: ".format(pageNo), execution_indicators_list , end="\n") 
    else:
        print("*****no ei available in page {}*******".format(pageNo), end="\n\n")
        
    return execution_indicators_list

def get_relevant_devices_from_session(request, pageNo):
    relevant_devices_list = []
    
    if request.session.get("relevant_device_list"):
        relevant_devices_list = request.session["relevant_device_list"]
        # print("selected ei available page {}: ".format(pageNo), execution_indicators_list , end="\n") 
    else:
        print("*****no relevant device available in page {}*******".format(pageNo), end="\n\n")
        
    return relevant_devices_list


def get_final_json_for_database(user_id, device_list, routine_list, ei_list, unique_code):
    final_json = {}
    routines_with_device_ei = []
    final_json["user_id"] = user_id
    final_json["unique_code"] = unique_code
    
    # print("unique_code", unique_code)
    # print("device_list", device_list)
    # print("routine_list", routine_list)
    # print("ei_list", ei_list)
    
    for i in range(len(routine_list)):
        single_routine_data = {}
        
        single_routine_data["trigger"] = routine_list[i][0]
        single_routine_data["trigger_relevant_device"] = device_list[i][0]
        single_routine_data["action"] = routine_list[i][1]
        single_routine_data["action_relevant_device"] = device_list[i][1]
        single_routine_data["execution_indicators"] = [ei_list[i][0], ei_list[i][1], ei_list[i][2], ei_list[i][3], ei_list[i][4]]
        
        routines_with_device_ei.append(single_routine_data)    
    
    final_json["created_routines"] = routines_with_device_ei
    
    return final_json


def delete_all_the_sessions(request):
    if request.session.get("selected_devices"):
        del request.session["selected_devices"]
        request.session.modified = True
        
    if request.session.get("created_routines"):
        del request.session["created_routines"]
        request.session.modified = True
        
    if request.session.get("execution_indicators"):
        del request.session["execution_indicators"]
        request.session.modified = True
        
    if request.session.get("relevant_device_list"):
        del request.session["relevant_device_list"]
        request.session.modified = True