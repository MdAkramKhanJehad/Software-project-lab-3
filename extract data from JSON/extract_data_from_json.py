import json

appliances = ["Air Conditioner", "Refrigerator", "Air Cooler", "Clothes Dryer", "Fan", "Humidifier", "Thermostat", "Vent", "Dehumidifier", "Air Purifier", "Water Heater", "Electric Blanket" , "Airer"]
securityAndSafety = ["CO Detector", "Smoke Detector", "Smart IR", "Door Lock", "Garage Door Opener", "Glass Break Detector", "Security Alarm", "Security Camera", "Water Leak Detector", "Doorbell", "Tilt Sensor", "Smart  Water Monitor and Shutoff Valve"]
kitchenAndCleaning = ["Bread Maker", "Dishwasher", "Dust Detector", "Gas Stove", "Induction CookTop", "Kettle", "Microwave Oven", "Oil Warmer", "Rice Cooker", "Robot Vacuum", "Sous Vide", "SoyMilk Maker", "Coffee Maker", "Milk Dispenser", "Water Filter", "Water Purifier"]
multimedia = ["Audio Player", "Smart Mirror", "Smart TV", "Speaker"]
health = ["Blood Oximeter", "Blood Pressure Monitor", "Pulse Monitor", "Sleep Monitor"]
lightsAndSwitches = ["Light Bulb", "Switches", "LED strip", "Scene Switch", "Lighting Remote", "Illuminance Sensor", "Button"]
gardeningDevices = ["Sprinkler", "Valve", "Plant Grower", "Weather Station", "pH Sensor", "Moisture Sensor", "Temperature Sensor"]
sensors = ["Gas Sensor", "Humidity Sensor", "Motion Sensor", "Open/Close Sensor", "Presence Sensor", "Step Sensor", "Door Sensor" ]
others = ["Beacon Device", "Shades/Blinds", "Smart Printer", "Energy Meter", "Smart Battery", "Curtains", "Car Automation", "Geolocation Monitor", "Smart Assistant"]


f = open('daniel_data.json')
data = json.load(f)

dev_items = []


for item in data:
    # print(item)
    device_name = item["name"]
    # print(device_name)
    item_keys = []
    desc = {}
    attrAndDesc = []
    device_details = []
    for i in item["actions"]:
        # item_keys.append(list(i.keys())[0])
        temp_dict = {}
        temp_dict[i["name"]] = i["command"]
        temp_dict["desc"] = i["description"]
        attrAndDesc.append(temp_dict)


    if device_name in appliances:
        desc["Category"] = "Appliances"
    
    elif device_name in securityAndSafety:
        desc["Category"] = "Security & Safety"
    
    elif device_name in kitchenAndCleaning:
        desc["Category"] = "Kitchen & Cleaning"

    elif device_name in multimedia:
        desc["Category"] = "Multimedia"
        
    elif device_name in health:
        desc["Category"] = "Health"
        
    elif device_name in lightsAndSwitches:
        desc["Category"] = "Lights & Switches"
    
    elif device_name in gardeningDevices:
        desc["Category"] = "Gardening Devices"
       
    elif device_name in sensors:
        desc["Category"] = "Sensors"
    else:
        desc["Category"] = "Others"
    
    desc["AttributesAndDescriptions"] = attrAndDesc
    
    device_details.append({"Category": desc["Category"]})
    device_details.append({"AttributesAndDescriptions": desc["AttributesAndDescriptions"]})

    dev_items.append({device_name: device_details})

json_object = json.dumps(dev_items, indent = 3)
print(json_object)

with open("device_data.json", "w") as outfile:
    outfile.write(json_object)
