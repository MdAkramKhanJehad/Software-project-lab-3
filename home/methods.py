

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
