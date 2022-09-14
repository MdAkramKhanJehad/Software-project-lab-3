// var executionIndicatorsList = [];

// getExecutionIndicators();


// function getExecutionIndicators(){
//     executionIndicatorsList = document.getElementById("execution-indicators").getAttribute("data-execution-indicators");

//     executionIndicatorsList = executionIndicatorsList.replaceAll("['", '["');
//     executionIndicatorsList = executionIndicatorsList.replaceAll("',", '",');
//     executionIndicatorsList = executionIndicatorsList.replaceAll(" '", ' "');
//     executionIndicatorsList = executionIndicatorsList.replaceAll("']", '"]');
//     executionIndicatorsList = executionIndicatorsList.replaceAll("'", "\'");

//     executionIndicatorsList = JSON.parse(executionIndicatorsList);

//     console.log("ALL EIIIII: " + executionIndicatorsList.length);

//     for (let i = 0; i < executionIndicatorsList.length; i++) {
//         console.log("EI's: " + " " + executionIndicatorsList[i][0] + " -> " + executionIndicatorsList[i][1]);
//     }
// }


$('#nextBtn').click(function(){
    var url, routineData = {"0":"0"};
    
    url = "/home/create/confirmation";

    $.ajax(
        {
            type:"POST",
            url: url,
            headers:{'X-CSRFToken':$("input[name='csrfmiddlewaretoken']").val()},
            data: {
                routines: routineData,
            },
            success: function() 
            {   
                console.log("successssssssss");
                window.location.href = "/home/create/complete";
            }
        }
    );
    
});