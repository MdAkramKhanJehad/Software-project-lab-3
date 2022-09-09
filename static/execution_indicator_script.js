var previouslyCreatedRoutines;
getPreviouslyCreatedRoutinesFromSession();


function getPreviouslyCreatedRoutinesFromSession(){
    previouslyCreatedRoutines = document.getElementById("created-routines").getAttribute("data-created-routines");

    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("['", '["');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("',", '",');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll(" '", ' "');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("']", '"]');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("'", "\'");

    previouslyCreatedRoutines = JSON.parse(previouslyCreatedRoutines);

    for (let i = 0; i < previouslyCreatedRoutines.length; i++) {
        console.log("Routines: " + " " + previouslyCreatedRoutines[i][0] + " -> " + previouslyCreatedRoutines[i][1]);
    }

    
}

for (let i = 1; i < previouslyCreatedRoutines.length + 1; i++) {
    for (let j = 1; j < 6; j++) {
        var eiId = "#ei-" + j + "-routine-" + i;
        $(eiId).on('click',function() {
            if($(this).val() != "Select"){
                console.log("Routine:" + i + " EI:" + j + $(this).val());
            }
            
        });
    }
}


