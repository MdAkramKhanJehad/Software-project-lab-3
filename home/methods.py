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