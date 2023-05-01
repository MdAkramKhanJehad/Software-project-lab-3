// var executionIndicatorsList = [];

// getExecutionIndicators();

var unique_code = document.getElementById("unique-code").getAttribute("data-unique-code");
// console.log("YESSSSSSSSSSsss");
// console.log(unique_code);

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
    var url, uni_code = {"code":unique_code};
    
    url = "/home/create/confirmation";

    $.ajax(
        {
            type:"POST",
            url: url,
            headers:{'X-CSRFToken':$("input[name='csrfmiddlewaretoken']").val()},
            data: {
                unique_code: uni_code,
            },
            success: function() 
            {   
                // console.log("successssssssss");
                window.location.href = "/home/create/complete";
            }
        }
    );
    
});