var currentTab = 0; 
var totalRoutine = 1;
var selectedDevices = [];
showTab(currentTab); 


const pageNo = document.getElementById("page-number").getAttribute("data-page-number");
console.log("page no: ", pageNo);
showButton();

if(pageNo == 1){

    // change style of previously selected devices
    var selectedDevicesFromSession = document.getElementById("selected-device").getAttribute("data-selected-device");
    console.log("sel dev: ", selectedDevicesFromSession);
    console.log(typeof selectedDevicesFromSession);

    selectedDevicesFromSession = selectedDevicesFromSession.replace(/'/g, '"')
    selectedDevices = JSON.parse(selectedDevicesFromSession);

    for (const selectedDevice of selectedDevices){
        styleChangeAfterSelection(selectedDevice);
    }
    
}



function showTab(n) {
    // This function will display the specified tab of the form...
  
    var x = document.getElementsByClassName("step");
    console.log("length: ", x.length )
    // console.log()
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    //... and run a function that will display the correct step indicator:
    fixStepIndicator(n)
}


function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("step");
    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
    // ... the form gets submitted:
        document.getElementById("signUpForm").submit();
        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName("step");
    y = x[currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
        // add an "invalid" class to the field:
        y[i].className += " invalid";
        // and set the current valid status to false
        valid = false;
    }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
    document.getElementsByClassName("stepIndicator")[currentTab].className += " finish";
    }
    return valid; // return the valid status
}

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("stepIndicator");
    for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    x[n].className += " active";
}


function addNewRoutine(){

    if (document.getElementById("trigger").value=='' && document.getElementById("action").value=='') return false;

    makeCloneNode();
    setOldRoutineTriggerActionId();

    document.getElementById("trigger").value = '';
    document.getElementById("action").value = '';

    totalRoutine += 1;
    console.log(totalRoutine);
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

    console.log(firstElementAction.getAttribute("id"));
}



function showButton(){
    if (pageNo == 1) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }

    if (pageNo == 5) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }

    if(pageNo == 1 ){
        document.getElementById("nextBtn").href = "/home/create/routine";
        console.log("this is page 1");

    } else if( pageNo == 2){
        document.getElementById("nextBtn").href = "/home/create/edit-delete-routine";
        document.getElementById("prevBtn").href = "/home/create/select-device";

    } else if( pageNo == 3){
        document.getElementById("nextBtn").href = "/home/create/execution-indication";
        document.getElementById("prevBtn").href = "/home/create/routine";

    } else if( pageNo == 4){
        document.getElementById("nextBtn").href = "/home/create/confirmation";
        document.getElementById("prevBtn").href = "/home/create/edit-delete-routine";
        
    } else {
        document.getElementById("nextBtn").href = "/home/create/complete";
        document.getElementById("prevBtn").href = "/home/create/execution-indication";
    }

    fixStepIndicator(pageNo-1);

}

function selectedCard(device){
    const index = selectedDevices.indexOf(device);
    
    if(index > -1){
        //remove from selected device
        selectedDevices.splice(index, 1);
        styleChangeAfterDeselection(device);
    
    }else {
        //add in selected device
        selectedDevices.push(device);
        styleChangeAfterSelection(device);
    }
    
    console.log("all dev : " + selectedDevices);
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


// function handleNextButtonClick

$('#nextBtn').click(function(){
    var data, nextBtnUrl, dataDev = {};
    if(pageNo == 1){
        nextBtnUrl = "/home/create/select-device";
        data = selectedDevices;
        for (let i = 0; i < selectedDevices.length; i++) {
            dataDev[i] = selectedDevices[i];
        }
    } 

    
    $.ajax(
    {
        type:"POST",
        url: nextBtnUrl,
        headers:{'X-CSRFToken':$("input[name='csrfmiddlewaretoken']").val()},
        data: {
            devices: dataDev
        },
        success: function() 
        {   
            console.log("successssssssss");
        }
     });
});