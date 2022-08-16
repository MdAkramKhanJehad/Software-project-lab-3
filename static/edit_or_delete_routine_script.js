var previouslyCreatedRoutines;
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
}


function actionChanged(num){
    const action = document.getElementById("action-"+num).value
    console.log("action changed to: " + action + " | prev: " + previouslyCreatedRoutines[num-1][1]);
}