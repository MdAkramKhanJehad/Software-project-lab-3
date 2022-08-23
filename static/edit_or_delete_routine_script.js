var previouslyCreatedRoutines;
var totalChecked = 0;
var url = "/home/create/edit-delete-routine";
getPreviouslyCreatedRoutinesFromSession();


function getPreviouslyCreatedRoutinesFromSession(){
    previouslyCreatedRoutines = document.getElementById("created-routines").getAttribute("data-created-routines");
    previouslyCreatedRoutines = previouslyCreatedRoutines.replace(/'/g, '"');
    previouslyCreatedRoutines = JSON.parse(previouslyCreatedRoutines);
}


function triggerChanged(num){
    const trigger = document.getElementById("trigger-"+num).value

    if(trigger != previouslyCreatedRoutines[num-1][0]){
        document.getElementById('nextBtn').className += " disabled";
    } else{
        document.getElementById('nextBtn').className = document.getElementById('nextBtn').className.replace(" disabled", ""); 
    }

}


function actionChanged(num){
    const action = document.getElementById("action-"+num).value
    // console.log("action changed to: " + action + " | prev: " + previouslyCreatedRoutines[num-1][1]);

    if(action != previouslyCreatedRoutines[num-1][1]){
        document.getElementById('nextBtn').className += " disabled";
    } else{
        document.getElementById('nextBtn').className = document.getElementById('nextBtn').className.replace(" disabled", ""); 
    }
}


function updateRoutine(num){
    const trigger = document.getElementById("trigger-"+num).value;
    const action = document.getElementById("action-"+num).value;
    var routineData = {};
    const allRoutines = previouslyCreatedRoutines;

    if(trigger != previouslyCreatedRoutines[num-1][0] || action != previouslyCreatedRoutines[num-1][1] ){
        console.log("trigger changed to: " + trigger  + " | prev: " + previouslyCreatedRoutines[num-1][0]);
        console.log("action changed to: " + action + " | prev: " + previouslyCreatedRoutines[num-1][1]);

        console.log("allroutine previous: ", allRoutines);
        var routine = [trigger, action];
        allRoutines.splice(num-1, 1, routine);
        console.log("allroutine after: ", allRoutines);

        var updatedRoutines = getRoutinesForSending(allRoutines);

        for (let i = 0; i < updatedRoutines.length; i++) {
            routineData[i] = updatedRoutines[i];
        }

        $.ajax(
            {
                type:"POST",
                url: url,
                headers:{'X-CSRFToken':$("input[name='csrfmiddlewaretoken']").val()},
                data: {
                    routines: routineData,
                    name: "update"
                },
                success: function() 
                {   
                    console.log("successssssssss");
                    window.location.href = "/home/create/edit-delete-routine";
                }
            }
        );

    } else{
        console.log("Nothing to change");
    }
 
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


function getRoutinesForSending(routines){
    var allRoutines = [];
    for (let i = 0; i < routines.length; i++) {
        var routine = {};

        routine["trigger"] = routines[i][0];
        routine["action"] = routines[i][1];   
        allRoutines.push(routine);
    }

    return allRoutines;
}


function deleteRoutine(num){
    var routineData = {};
    console.log("delete routines");
    // console.log(previouslyCreatedRoutines[num - 1][0] + " -> " + previouslyCreatedRoutines[num - 1][1]);

    const previousRoutines = previouslyCreatedRoutines;
    previousRoutines.splice(num, 1);

    for (let i = 0; i < previousRoutines.length; i++) {
        console.log("Routines del: " + " " + previousRoutines[i][0] + " -> " + previousRoutines[i][1]);
    }

    
    var updatedRoutines = getRoutinesForSending(previousRoutines);

    for (let i = 0; i < updatedRoutines.length; i++) {
        routineData[i] = updatedRoutines[i];
    }

    $(".btn-close").click();

    $.ajax(
        {
            type:"POST",
            url: url,
            headers:{'X-CSRFToken':$("input[name='csrfmiddlewaretoken']").val()},
            data: {
                routines: routineData,
                name: "delete"
            },
            success: function() 
            {   
                console.log("successssssssss");
                window.location.href = "/home/create/edit-delete-routine";
            }
        }
    );
}

