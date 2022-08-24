var currentlyShowing = "state-0";
var currentlyShowingEnvVar = "state-environmental-variables-0";
var currentlySelectedDevice;
var currentlySelectedEnvVar;
var totalRoutine = 1;
var previouslyCreatedRoutines;
var createdRoutines = [];
var environmental_variables;

document.getElementById(currentlyShowing).style.display = "block";
document.getElementById(currentlyShowingEnvVar).style.display = "block";

setFirstDeviceStyle();
getEnvironmentalVariable();
setFirstEnvVarStyle();
getPreviouslyCreatedRoutinesFromSession();
addPreviouslyCreatedRoutinesFromSessionInUI();



function getEnvironmentalVariable(){
    environmental_variables = document.getElementById("environmental-variables").getAttribute("data-environmental-variables");
    environmental_variables = environmental_variables.replace(/'/g, '"');
    environmental_variables = JSON.parse(environmental_variables);

    console.log(environmental_variables.length);
    for (let i = 0; i < environmental_variables.length; i++) {
        console.log("Environmental Variables: " + " " + environmental_variables[i][0] + " -> " + environmental_variables[i][1]);
    }
}

function getPreviouslyCreatedRoutinesFromSession(){
    previouslyCreatedRoutines = document.getElementById("created-routines").getAttribute("data-created-routines");
    previouslyCreatedRoutines = previouslyCreatedRoutines.replace(/'/g, '"');
    previouslyCreatedRoutines = JSON.parse(previouslyCreatedRoutines);

    for (let i = 0; i < previouslyCreatedRoutines.length; i++) {
        console.log("Routines: " + " " + previouslyCreatedRoutines[i][0] + " -> " + previouslyCreatedRoutines[i][1]);
    }
}


function addPreviouslyCreatedRoutinesFromSessionInUI(){
    console.log(totalRoutine);
    totalRoutine += previouslyCreatedRoutines.length;
}


function setFirstDeviceStyle(){
    var selectedDevicesFromSession = document.getElementById("selected-device").getAttribute("data-previously-selected-device");
    selectedDevicesFromSession = selectedDevicesFromSession.replace(/'/g, '"');
    selectedDevicesFromSession = JSON.parse(selectedDevicesFromSession);
    currentlySelectedDevice = selectedDevicesFromSession[0];

    styleChangeAfterSelection(currentlySelectedDevice);
}


function setFirstEnvVarStyle(){
    currentlySelectedEnvVar = environmental_variables[0][0];
    styleChangeAfterSelection(currentlySelectedEnvVar);
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


function showEnvVarAttributes(index){
    styleChangeAfterDeselection(currentlySelectedEnvVar);
    currentlySelectedEnvVar = environmental_variables[index][0];
    styleChangeAfterSelection(currentlySelectedEnvVar);

    document.getElementById(currentlyShowingEnvVar).style.display = "none";

    const device_elememt = document.getElementById(currentlySelectedEnvVar);
    // const index_env_var = device_elememt.getAttribute("data-index-env-var");
    currentlyShowingEnvVar = "state-environmental-variables-"+index;
    const selected_env_var = document.getElementById(currentlyShowingEnvVar)
    selected_env_var.style.display = "block";
}


function addNewRoutine(){
    if (document.getElementById("trigger").value=='' || document.getElementById("action").value=='') return false;

    makeCloneNode();
    setOldRoutineTriggerActionId();

    document.getElementById("trigger").value = '';
    document.getElementById("action").value = '';

    totalRoutine += 1;
    console.log("total routine: " + totalRoutine);
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
    document.getElementById(device).style.boxShadow = "5px 6px 6px 2px #e9ecef";
    document.getElementById(device).style.backgroundColor = "#198754";
    document.getElementById(device).style.color = "white";
    document.getElementById(device).style.borderRadius = "10px";
}


function styleChangeAfterDeselection(device){
    document.getElementById(device).className = document.getElementById(device).className.replace(" selected", "");
    console.log(document.getElementById(device).getAttribute('class'));

    document.getElementById(device).style.transform = "scale(1)";
    document.getElementById(device).style.boxShadow = "none";
    document.getElementById(device).style.backgroundColor = "transparent";
    document.getElementById(device).style.color = "black";
}


function getAllNewlyCreatedRoutines(){
    for (let i = 1; i < totalRoutine; i++) {
        var routine = {};

        var triggerId = "trigger" + i;
        var actionId = "action" + i;

        const trigger = document.getElementById(triggerId).value;
        const action = document.getElementById(actionId).value;

        // there will e a list of routine, each routine is a list consist of trigger (at index 0), and action (at index 1)
        routine["trigger"] = trigger;
        routine["action"] = action   
        createdRoutines.push(routine);

        console.log(routine)
    }
   
    if(document.getElementById("trigger").value != "" &&  document.getElementById("action").value != ""){
        var routine = {};
        const trigger = document.getElementById("trigger").value;
        const action = document.getElementById("action").value;

        routine["trigger"] = trigger;
        routine["action"] = action   
        createdRoutines.push(routine);
            
        console.log(routine);
    }
}


$('#nextBtn').click(function(){
    var url, routineData = {};
    
    url = "/home/create/routine";
    getAllNewlyCreatedRoutines();

    for (let i = 0; i < createdRoutines.length; i++) {
        routineData[i] = createdRoutines[i];
    }

    $.ajax(
        {
            type:"POST",
            url: url,
            headers:{'X-CSRFToken':$("input[name='csrfmiddlewaretoken']").val()},
            data: {
                routines: routineData
            },
            success: function() 
            {   
                console.log("successssssssss");
                window.location.href = "/home/create/edit-delete-routine";
            }
        }
    );
    
});