var previouslyCreatedRoutines;
var totalChecked = 0;
getPreviouslyCreatedRoutinesFromSession();


function getPreviouslyCreatedRoutinesFromSession(){
    previouslyCreatedRoutines = document.getElementById("created-routines").getAttribute("data-created-routines");
    previouslyCreatedRoutines = previouslyCreatedRoutines.replace(/'/g, '"');
    previouslyCreatedRoutines = JSON.parse(previouslyCreatedRoutines);

    console.log("inside func")
    for (let i = 0; i < previouslyCreatedRoutines.length; i++) {
        console.log("Routines in page 3: " + " " + previouslyCreatedRoutines[i][0] + " -> " + previouslyCreatedRoutines[i][1]);
    }
}


function triggerChanged(num){
    const trigger = document.getElementById("trigger-"+num).value
    console.log("trigger changed to: " + trigger  + " | prev: " + previouslyCreatedRoutines[num-1][0]);

    // const id = "update-" + num;
    // document.getElementById(id).style.backgroundColor = "#C1FBC9";
    // document.getElementById(id).style.color = "black";
    console.log("typee");
    console.log( typeof previouslyCreatedRoutines[0]);
}


function actionChanged(num){
    const action = document.getElementById("action-"+num).value
    console.log("action changed to: " + action + " | prev: " + previouslyCreatedRoutines[num-1][1]);
}


function updateRoutine(num){
    const trigger = document.getElementById("trigger-"+num).value;
    const action = document.getElementById("action-"+num).value;

    const allRoutines = previouslyCreatedRoutines;



    // allRoutines.splice(num, 1, [trigger, action]);
    //  onclick="updateRoutine('{{forloop.counter}}')" 
}


function deleteRoutine(num){
    console.log("delete routine");
}


function checkboxCount(element){
    if(element.checked == true){
        totalChecked += 1;
        console.log(totalChecked);
    } else{
        totalChecked -= 1;
        console.log(totalChecked);
    }

    if(totalChecked > 0){
        document.getElementById('delete-selected').className = document.getElementById('delete-selected').className.replace(" disabled", "");
        document.getElementById('delete-selected').className = document.getElementById('delete-selected').className.replace(" text-black-50", "");
    } else{
        document.getElementById('delete-selected').className += " disabled";
        document.getElementById('delete-selected').className += " text-black-50";
    }
}
