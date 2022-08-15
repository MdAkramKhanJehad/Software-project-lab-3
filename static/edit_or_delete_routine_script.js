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