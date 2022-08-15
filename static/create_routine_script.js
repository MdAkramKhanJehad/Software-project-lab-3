var currentlyShowing = "state-0";
var currentlySelectedDevice;
var totalRoutine = 1;
var createdRoutines = [];
document.getElementById(currentlyShowing).style.display = "block";
setFirstDeviceStyle();



function setFirstDeviceStyle(){
    var selectedDevicesFromSession = document.getElementById("selected-device").getAttribute("data-previously-selected-device");
    selectedDevicesFromSession = selectedDevicesFromSession.replace(/'/g, '"');
    selectedDevicesFromSession = JSON.parse(selectedDevicesFromSession);
    currentlySelectedDevice = selectedDevicesFromSession[0];

    styleChangeAfterSelection(currentlySelectedDevice);
}


function showAttributes(device){
    styleChangeAfterDeselection(currentlySelectedDevice);
    currentlySelectedDevice = device;
    styleChangeAfterSelection(currentlySelectedDevice);

    document.getElementById(currentlyShowing).style.display = "none";
    
    const device_elememt = document.getElementById(device);
    const index = device_elememt.getAttribute("data-index");
    currentlyShowing = "state-"+index;
    const selected_device = document.getElementById(currentlyShowing)
    selected_device.style.display = "block";
}


function addNewRoutine(){

    if (document.getElementById("trigger").value=='' && document.getElementById("action").value=='') return false;

    makeCloneNode();
    setOldRoutineTriggerActionId();

    document.getElementById("trigger").value = '';
    document.getElementById("action").value = '';
    console.log("total routine 2 : " + totalRoutine);

    totalRoutine += 1;
    console.log("total routine 3 : " + totalRoutine);
}


function makeCloneNode(){
    const node = document.getElementById("routineField");
    const clone = node.cloneNode(true);
    document.getElementById("routineHolder").appendChild(clone); 
}


function setOldRoutineTriggerActionId(){
    const firstElement = document.getElementById("routineField")
    const newId = "routineField" + totalRoutine.toString()
    firstElement.setAttribute("id", newId);

    console.log(firstElement.getAttribute("id"));

    const firstElementTrigger = document.getElementById("trigger")
    const triggerNewId = "trigger" + totalRoutine.toString()
    firstElementTrigger.setAttribute("id", triggerNewId);

    console.log(firstElementTrigger.getAttribute("id"));

    const firstElementAction = document.getElementById("action")
    const actionNewId = "action" + totalRoutine.toString()
    firstElementAction.setAttribute("id", actionNewId);

    console.log("total routine: " + totalRoutine);
}


function styleChangeAfterSelection(device){
    document.getElementById(device).className += " selected";
    console.log(document.getElementById(device).getAttribute('class'));

    document.getElementById(device).style.transform = "scale(1.11)";
    document.getElementById(device).style.backgroundColor = "#198754";
    document.getElementById(device).style.color = "white";
    document.getElementById(device).style.borderRadius = "10px";
}


function styleChangeAfterDeselection(device){
    document.getElementById(device).className = document.getElementById(device).className.replace(" selected", "");
    console.log(document.getElementById(device).getAttribute('class'));

    document.getElementById(device).style.transform = "scale(1)";
    document.getElementById(device).style.backgroundColor = "white";
    document.getElementById(device).style.color = "black";
}