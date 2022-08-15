var currentlyShowing = "state-0";
var currentlySelectedDevice;
var totalRoutine = 1;
var previouslyCreatedRoutines;
var createdRoutines = [];
document.getElementById(currentlyShowing).style.display = "block";
setFirstDeviceStyle();
getPreviouslyCreatedRoutinesFromSession();



function getPreviouslyCreatedRoutinesFromSession(){
    previouslyCreatedRoutines = document.getElementById("created-routines").getAttribute("data-created-routines");
    previouslyCreatedRoutines = previouslyCreatedRoutines.replace(/'/g, '"');
    previouslyCreatedRoutines = JSON.parse(previouslyCreatedRoutines);

    for (let i = 0; i < previouslyCreatedRoutines.length; i++) {
        console.log("Routines: " + " " + previouslyCreatedRoutines[i][0] + " -> " + previouslyCreatedRoutines[i][1]);
    }
}


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

    if (document.getElementById("trigger").value=='' || document.getElementById("action").value=='') return false;

    makeCloneNode();
    setOldRoutineTriggerActionId();

    // add trigger action in list
    var triggerId = "trigger" + totalRoutine;
    var actionId = "action" + totalRoutine;
    var routine = {};

    const trigger = document.getElementById(triggerId).value;
    const action = document.getElementById(actionId).value;

    // there will e a list of routine, each routine is a list consist of trigger (at index 0), and action (at index 1)
    routine["trigger"] = trigger;
    routine["action"] = action   
    createdRoutines.push(routine);

    document.getElementById("trigger").value = '';
    document.getElementById("action").value = '';

    totalRoutine += 1;
    console.log("total routine: " + totalRoutine);

    // for (let i = 0; i < createdRoutines.length; i++) {
    //     console.log("Routines: " + i + " " + createdRoutines[i] + " ||| ");
    // }

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

    // console.log(firstElement.getAttribute("id"));

    const firstElementTrigger = document.getElementById("trigger")
    const triggerNewId = "trigger" + totalRoutine.toString()
    firstElementTrigger.setAttribute("id", triggerNewId);

    // console.log(firstElementTrigger.getAttribute("id"));

    const firstElementAction = document.getElementById("action")
    const actionNewId = "action" + totalRoutine.toString()
    firstElementAction.setAttribute("id", actionNewId);

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


$('#nextBtn').click(function(){
    var nextBtnUrl, routineData = {};
    
    nextBtnUrl = "/home/create/routine";

    for (let i = 0; i < createdRoutines.length; i++) {
        routineData[i] = createdRoutines[i];
    }

    $.ajax(
        {
            type:"POST",
            url: nextBtnUrl,
            headers:{'X-CSRFToken':$("input[name='csrfmiddlewaretoken']").val()},
            data: {
                routines: routineData
            },
            success: function() 
            {   
                console.log("successssssssss");
                // window.location.href = "/home/create/edit-delete-routine";
            }
        }
    );
    
});