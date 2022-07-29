import json


cat1 = ["Air Conditioner", "Air Cooler", "Beacon Device", "Clothes Dryer", "Coffee Maker", "Fan", "Humidifier", "Light Bulb", "Shades/Blinds", "Smart Printer", "Sprinkler", "Thermostat", "Vent", "Weather Station"]
cat2 = ["Bread Maker", "Dishwasher", "Dust Detector", "Gas Stove", "Induction CookTop", "Kettle", "Microwave Oven", "Oil Warmer", "Refrigerator", "Rice Cooker", "Robot Vacuum", "Sous Vide", "SoyMilk Maker", "Water Heater"]
cat3 = ["Audio Player", "Blood Pressure Monitor", "Door Lock", "Garage Door Opener", "Glass Break Detector", "Pulse Monitor", "Security Alarm", "Security Camera", "Sleep Monitor", "Smart Mirror", "Smart TV", "Speaker", "Water Leak Detector", "Water Purifier"]
cat4 = ["CO Detector", "Gas Sensor", "Humidity Sensor", "Illuminance Sensor", "Moisture Sensor", "Motion Sensor", "Open/Close Sensor", "PH Sensor", "Presence Sensor", "Smart IR", "Smoke Detector", "Step Sensor", "Temperature Sensor", "Tilt Sensor"]


f = open('data.json')
data = json.load(f)


def get_device():
    count = 0
    count2 = 0
    devices = []
    for item in data:
        for key in item.keys():
            devices.append(key)
            count += 1
        count2 += 1


    print(count)
    print(count2)
    print("device list length: ", len(devices))
    return devices


devices = get_device()


dev_dict = {}

for item in data:
    device_name = list(item.keys())[0]
    item_keys = []
    desc = {}
    for i in item[device_name]:
        item_keys.append(list(i.keys())[0])

    if device_name in cat1:
        desc["Category"] = "Appliances"
        
    elif device_name in cat2:
        desc["Category"] = "Kitchen & Cleaning"

    elif device_name in cat3:
        desc["Category"] = "Safety & Multimedia"
    
    elif device_name in cat4:
        desc["Category"] = "Sensors"
    
    else:
        desc["Category"] = "Others"
    
    desc["Attributes"] = item_keys
    dev_dict[device_name]= desc

json_object = json.dumps(dev_dict, indent = 4)
print(json_object)

with open("final.json", "w") as outfile:
    outfile.write(json_object)