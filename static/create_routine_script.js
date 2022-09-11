var currentlyShowing = "state-0";
var currentlyShowingEnvVar = "state-environmental-variables-0";
var currentlySelectedDevice;
var currentlySelectedEnvVar;
var totalRoutine = 1;
var previouslyCreatedRoutines;
var totalPreviouslyCreatedRoutines = 0;
var createdRoutines = [];
var environmental_variables;
var currentlySelectedDeviceCommands = [];

document.getElementById(currentlyShowing).style.display = "block";
document.getElementById(currentlyShowingEnvVar).style.display = "block";


getPreviouslyCreatedRoutinesFromSession();
addPreviouslyCreatedRoutinesFromSessionInUI();
setFirstDeviceStyle();
getEnvironmentalVariable();
setFirstEnvVarStyle();
callAutoCompleteMethod();




function getEnvironmentalVariable(){
    environmental_variables = document.getElementById("environmental-variables").getAttribute("data-environmental-variables");
    environmental_variables = environmental_variables.replace(/'/g, '"');
    environmental_variables = JSON.parse(environmental_variables);

    console.log(environmental_variables.length);
    // for (let i = 0; i < environmental_variables.length; i++) {
    //     console.log("Environmental Variables: " + " " + environmental_variables[i][0] + " -> " + environmental_variables[i][1]);
    // }
}

function getPreviouslyCreatedRoutinesFromSession(){
    previouslyCreatedRoutines = document.getElementById("created-routines").getAttribute("data-created-routines");
    console.log("BEFORE PARSE:" + previouslyCreatedRoutines);
    
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("['", '["');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("',", '",');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll(" '", ' "');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("']", '"]');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("'", "\'");

    previouslyCreatedRoutines = JSON.parse(previouslyCreatedRoutines);
    // previouslyCreatedRoutines = JSON.stringify(JSON5.parse(previouslyCreatedRoutines))

    for (let i = 0; i < previouslyCreatedRoutines.length; i++) {
        console.log("Routines: " + " " + previouslyCreatedRoutines[i][0] + " -> " + previouslyCreatedRoutines[i][1]);
    }

    totalPreviouslyCreatedRoutines = previouslyCreatedRoutines.length
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
    getCurretDeviceCommands();
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

    getCurretDeviceCommands();

}


function getCurretDeviceCommands(){
    var attr = document.getElementById(currentlyShowing).getAttribute('data-attribute')
    attr = attr.replace(/'/g, '"');
    attr = JSON.parse(attr);

    currentlySelectedDeviceCommands = [];
    for (let i = 0; i < attr.length; i++) {
        currentlySelectedDeviceCommands[i] = attr[i][1];
    }

    // currentlySelectedDeviceCommands = attr
    console.log("lengths: " + currentlySelectedDeviceCommands.length);

    callAutoCompleteMethod();
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

    callAutoCompleteMethod();
    
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


function autocomplete(inp, arr) {

    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });

    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
        
          currentFocus++;
          addActive(x);
        } else if (e.keyCode == 38) { //up
          
          currentFocus--;
          addActive(x);
        } else if (e.keyCode == 13) {
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}


function callAutoCompleteMethod(){
    autocomplete(document.getElementById("trigger"), currentlySelectedDeviceCommands);
    autocomplete(document.getElementById("action"), currentlySelectedDeviceCommands);

    for (let i = 1; i < totalPreviouslyCreatedRoutines + 1; i++) {
        var trigID = "trigger" + i.toString();
        var actID = "action" + i.toString();
        autocomplete(document.getElementById(trigID), currentlySelectedDeviceCommands);
        autocomplete(document.getElementById(actID), currentlySelectedDeviceCommands);
    }
}