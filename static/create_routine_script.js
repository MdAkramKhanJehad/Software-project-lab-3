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
    previouslyCreatedRoutines = previouslyCreatedRoutines.replace(/'/g, '"');
    previouslyCreatedRoutines = JSON.parse(previouslyCreatedRoutines);

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



// auto complete

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    // var inp = element;
    
    // var arr = getCurretDeviceCommands;
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

/*An array containing all the country names in the world:*/

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/


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