var previouslyCreatedRoutines;
var totalChecked = 0;
getPreviouslyCreatedRoutinesFromSession();


function getPreviouslyCreatedRoutinesFromSession(){
    previouslyCreatedRoutines = document.getElementById("created-routines").getAttribute("data-created-routines");
    previouslyCreatedRoutines = previouslyCreatedRoutines.replace(/'/g, '"');
    previouslyCreatedRoutines = JSON.parse(previouslyCreatedRoutines);

    // console.log("inside func")
    // for (let i = 0; i < previouslyCreatedRoutines.length; i++) {
    //     console.log("Routines: " + " " + previouslyCreatedRoutines[i][0] + " -> " + previouslyCreatedRoutines[i][1]);
    // }
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
    var url, routineData = {};
    console.log("delete routines");
    // console.log(previouslyCreatedRoutines[num - 1][0] + " -> " + previouslyCreatedRoutines[num - 1][1]);

    const previousRoutines = previouslyCreatedRoutines;
    previousRoutines.splice(num, 1);

    for (let i = 0; i < previousRoutines.length; i++) {
        console.log("Routines del: " + " " + previousRoutines[i][0] + " -> " + previousRoutines[i][1]);
    }

    url = "/home/create/edit-delete-routine";
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
                routines: routineData
            },
            success: function() 
            {   
                console.log("successssssssss");
                window.location.href = "/home/create/edit-delete-routine";
            }
        }
    );
}

