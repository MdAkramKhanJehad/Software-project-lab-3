import json


appliances = ["Air Conditioner", "Air Cooler", "Beacon Device", "Clothes Dryer", "Coffee Maker", "Fan", "Humidifier", "Light Bulb", "Shades/Blinds", "Smart Printer", "Sprinkler", "Thermostat", "Vent", "Weather Station"]
kitchenAndCleaning = ["Bread Maker", "Dishwasher", "Dust Detector", "Gas Stove", "Induction CookTop", "Kettle", "Microwave Oven", "Oil Warmer", "Refrigerator", "Rice Cooker", "Robot Vacuum", "Sous Vide", "SoyMilk Maker", "Water Heater"]
safetyAndMultimedia = ["Audio Player", "Blood Pressure Monitor", "Door Lock", "Garage Door Opener", "Glass Break Detector", "Pulse Monitor", "Security Alarm", "Security Camera", "Sleep Monitor", "Smart Mirror", "Smart TV", "Speaker", "Water Leak Detector", "Water Purifier"]
sensors = ["CO Detector", "Gas Sensor", "Humidity Sensor", "Illuminance Sensor", "Moisture Sensor", "Motion Sensor", "Open/Close Sensor", "PH Sensor", "Presence Sensor", "Smart IR", "Smoke Detector", "Step Sensor", "Temperature Sensor", "Tilt Sensor"]


f = open('data.json')
data = json.load(f)


dev_items = []

for item in data:
    # print(item)
    device_name = list(item.keys())[0]
    # print(device_name)
    item_keys = []
    desc = {}
    attrAndDesc = []
    device_details = []
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
    
    device_details.append({"Category": desc["Category"]})
    device_details.append({"AttributesAndDescriptions": desc["AttributesAndDescriptions"]})

    dev_items.append({device_name: device_details})

json_object = json.dumps(dev_items, indent = 3)
print(json_object)

with open("device_data.json", "w") as outfile:
    outfile.write(json_object)

f2 = open('device_data.json')
data2 = json.load(f2)

# print(type(data2))

for item in data2:
    print(item)
    device_name = list(item.keys())[0]
    print("device: ", device_name)
    for i in item[device_name]:
        if list(i.keys())[0] == "Category":
            print(list(i.keys())[0], " ", i[list(i.keys())[0]])

        if list(i.keys())[0] == "AttributesAndDescriptions":
            for attr in list(i.values())[0]:
                print(list(attr.keys())[0], " : ", attr[list(attr.keys())[0]])
                print(list(attr.keys())[1], " : ", attr[list(attr.keys())[1]])

    print('\n')

