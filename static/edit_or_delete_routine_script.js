var previouslyCreatedRoutines;
var totalChecked = 0;
var selectedRoutinesIndex = [];
var url = "/home/create/edit-delete-routine";
getPreviouslyCreatedRoutinesFromSession();

for(let i = 1; i <= previouslyCreatedRoutines.length; i++) {
    var currentId = "update-"+i;
    document.getElementById(currentId).className += " disabled";
}


function getPreviouslyCreatedRoutinesFromSession(){
    previouslyCreatedRoutines = document.getElementById("created-routines").getAttribute("data-created-routines");
   
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("['", '["');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("',", '",');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll(" '", ' "');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("']", '"]');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("'", "\'");

    previouslyCreatedRoutines = JSON.parse(previouslyCreatedRoutines);
}


function triggerChanged(num){
    const trigger = document.getElementById("trigger-"+num).value
    const action = document.getElementById("action-"+num).value
    var currentUpdateId = "update-"+num;


    if(trigger.trim() != ""){
        if(trigger != previouslyCreatedRoutines[num-1][0]){
            // document.getElementById('nextBtn').className = document.getElementById('nextBtn').className.replace(" disabled", "");
            document.getElementById("nextBtn").disabled = false;
            // document.getElementById('nextBtn').className += " disabled";
            document.getElementById("nextBtn").disabled = true;
            
            document.getElementById(currentUpdateId).className = document.getElementById(currentUpdateId).className.replace(" disabled", "");
    
        } else{
            if(action == previouslyCreatedRoutines[num-1][1]){
                // console.log("tri: " + trigger + " | act: " + action)
                var flag = 0;
    
                // checking whether any other trigger or action is edited or not
                for(let i = 1; i <= previouslyCreatedRoutines.length; i++) {
                    var currentTriggerId = "trigger-"+i;
                    var currentActionId = "action-"+i;
                    if((document.getElementById(currentTriggerId).value != previouslyCreatedRoutines[i-1][0]) || (document.getElementById(currentActionId).value != previouslyCreatedRoutines[i-1][1])){
                        flag = 1;
                    }
                }
    
                if(flag == 0){
                //   document.getElementById('nextBtn').className = document.getElementById('nextBtn').className.replace(" disabled", ""); 
                    document.getElementById("nextBtn").disabled = false;  
                }
                document.getElementById(currentUpdateId).className += " disabled";
                
            }
        }
    }
}


function actionChanged(num){
    const action = document.getElementById("action-"+num).value
    const trigger = document.getElementById("trigger-"+num).value
    var currentUpdateId = "update-"+num;

    if(action.trim() != ""){
        if(action != previouslyCreatedRoutines[num-1][1]){
            // document.getElementById('nextBtn').className = document.getElementById('nextBtn').className.replace(" disabled", "");
            document.getElementById("nextBtn").disabled = false;
            // document.getElementById('nextBtn').className += " disabled";
            document.getElementById("nextBtn").disabled = true;
    
            document.getElementById(currentUpdateId).className = document.getElementById(currentUpdateId).className.replace(" disabled", "");
        } else{  
            if(trigger == previouslyCreatedRoutines[num-1][0]){
                // console.log("tri: " + trigger + " | act: " + action)
                var flag = 0;
    
                // checking whether any other trigger or action is edited or not
                for(let i = 1; i <= previouslyCreatedRoutines.length; i++) {
                    var currentTriggerId = "trigger-"+i;
                    var currentActionId = "action-"+i;
                    if((document.getElementById(currentTriggerId).value != previouslyCreatedRoutines[i-1][0]) || (document.getElementById(currentActionId).value != previouslyCreatedRoutines[i-1][1])){
                        flag = 1;
                    }
                }
    
                if(flag == 0){
                //   document.getElementById('nextBtn').className = document.getElementById('nextBtn').className.replace(" disabled", "");
                    document.getElementById("nextBtn").disabled = false;
                }
                
                document.getElementById(currentUpdateId).className += " disabled";
            }
        }
    }
    
}


function updateRoutine(num){
    const trigger = document.getElementById("trigger-"+num).value;
    const action = document.getElementById("action-"+num).value;
    var routineData = {};
    var index_no = num -1;
    const allRoutines = previouslyCreatedRoutines;

    if(trigger != previouslyCreatedRoutines[num-1][0] || action != previouslyCreatedRoutines[num-1][1] ){
        // console.log("trigger changed to: " + trigger  + " | prev: " + previouslyCreatedRoutines[num-1][0]);
        // console.log("action changed to: " + action + " | prev: " + previouslyCreatedRoutines[num-1][1]);

        // console.log("allroutine previous: ", allRoutines);
        var routine = [trigger, action];
        allRoutines.splice(num-1, 1, routine);
        // console.log("allroutine after: ", allRoutines);

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
                    index_number: index_no,
                    name: "update"
                },
                success: function() 
                {   
                    // console.log("successssssssss");
                    window.location.href = "/home/create/edit-delete-routine";
                }
            }
        );

    } 
    // else{
    //     console.log("Nothing to change");
    // }
 
}


function checkboxCount(element, indexValue){
    if(element.checked == true){
        totalChecked += 1;
        selectedRoutinesIndex.push(indexValue);
        // console.log("checked: " + indexValue);
    } else{
        totalChecked -= 1;
        // console.log(totalChecked);
        const index = selectedRoutinesIndex.indexOf(indexValue);
        selectedRoutinesIndex.splice(index,1)
        // console.log("Unchecked: " + indexValue);
    }

    // console.log(selectedRoutinesIndex);

    if(totalChecked > 0){
        document.getElementById('delete-selected').className = document.getElementById('delete-selected').className.replace(" disabled", "");
        document.getElementById('delete-selected').className = document.getElementById('delete-selected').className.replace(" text-black-50", "");
    } else{
        document.getElementById('delete-selected').className += " disabled";
        document.getElementById('delete-selected').className += " text-black-50";
    }
}


// function deleteSelectedRoutine(){
//     var routineData = {};
//     console.log("delete selected routines");
//     // console.log(previouslyCreatedRoutines[num - 1][0] + " -> " + previouslyCreatedRoutines[num - 1][1]);

//     const previousRoutines = previouslyCreatedRoutines;
//     console.log(previousRoutines);

//     selectedRoutinesIndex.sort();
//     selectedRoutinesIndex.reverse();
//     for(let i=0; i<totalChecked; i++){
//         previousRoutines.splice(selectedRoutinesIndex[i], 1);
//     }

//     console.log(previousRoutines);
    

//     // for (let i = 0; i < previousRoutines.length; i++) {
//     //     console.log("Routines del: " + " " + previousRoutines[i][0] + " -> " + previousRoutines[i][1]);
//     // }



    
//     var updatedRoutines = getRoutinesForSending(previousRoutines);

//     for (let i = 0; i < updatedRoutines.length; i++) {
//         routineData[i] = updatedRoutines[i];
//     }

//     $(".btn-close-selected-routine").click();

//     $.ajax(
//         {
//             type:"POST",
//             url: url,
//             headers:{'X-CSRFToken':$("input[name='csrfmiddlewaretoken']").val()},
//             data: {
//                 routines: routineData,
//                 name: "delete"
//             },
//             success: function() 
//             {   
//                 console.log("successssssssss");
//                 window.location.href = "/home/create/edit-delete-routine";
//             }
//         }
//     );
// }


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
    // console.log("delete routine no: " + num);
    // console.log(previouslyCreatedRoutines[num - 1][0] + " -> " + previouslyCreatedRoutines[num - 1][1]);

    const previousRoutines = previouslyCreatedRoutines;
    previousRoutines.splice(num, 1);

    // for (let i = 0; i < previousRoutines.length; i++) {
    //     console.log("Routines del: " + " " + previousRoutines[i][0] + " -> " + previousRoutines[i][1]);
    // }

    
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
                index_number: num,
                name: "delete"
            },
            success: function() 
            {   
                // console.log("successssssssss");
                window.location.href = "/home/create/edit-delete-routine";
            }
        }
    );
}


$('#nextBtn').click(function(){    

    $.ajax(
        {
            type:"GET",
            url: url,
            headers:{'X-CSRFToken':$("input[name='csrfmiddlewaretoken']").val()},
            success: function() 
            {   
                // console.log("successssssssss");
                window.location.href = "/home/create/execution-indicators";
            }
        }
    );
    
});