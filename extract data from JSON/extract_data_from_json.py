import json


appliances = ["Air Conditioner", "Air Cooler", "Beacon Device", "Clothes Dryer", "Coffee Maker", "Fan", "Humidifier", "Light Bulb", "Shades/Blinds", "Smart Printer", "Sprinkler", "Thermostat", "Vent", "Weather Station"]
kitchenAndCleaning = ["Bread Maker", "Dishwasher", "Dust Detector", "Gas Stove", "Induction CookTop", "Kettle", "Microwave Oven", "Oil Warmer", "Refrigerator", "Rice Cooker", "Robot Vacuum", "Sous Vide", "SoyMilk Maker", "Water Heater"]
safetyAndMultimedia = ["Audio Player", "Blood Pressure Monitor", "Door Lock", "Garage Door Opener", "Glass Break Detector", "Pulse Monitor", "Security Alarm", "Security Camera", "Sleep Monitor", "Smart Mirror", "Smart TV", "Speaker", "Water Leak Detector", "Water Purifier"]
sensors = ["CO Detector", "Gas Sensor", "Humidity Sensor", "Illuminance Sensor", "Moisture Sensor", "Motion Sensor", "Open/Close Sensor", "PH Sensor", "Presence Sensor", "Smart IR", "Smoke Detector", "Step Sensor", "Temperature Sensor", "Tilt Sensor"]


f = open('data.json')
data = json.load(f)


dev_dict = {}

for item in data:
    device_name = list(item.keys())[0]
    item_keys = []
    desc = {}
    attrAndDesc = []
    for i in item[device_name]:
        item_keys.append(list(i.keys())[0])
        attrAndDesc.append(i)

    if device_name in appliances:
        desc["Category"] = "Appliances"
        
    elif device_name in kitchenAndCleaning:
        desc["Category"] = "Kitchen & Cleaning"

    elif device_name in safetyAndMultimedia:
        desc["Category"] = "Safety & Multimedia"
    
    elif device_name in sensors:
        desc["Category"] = "Sensors"
    
    else:
        desc["Category"] = "Others"
    
    desc["AttributesAndDescriptions"] = attrAndDesc
    dev_dict[device_name]= desc

json_object = json.dumps(dev_dict, indent = 4)
print(json_object)

with open("final.json", "w") as outfile:
    outfile.write(json_object)