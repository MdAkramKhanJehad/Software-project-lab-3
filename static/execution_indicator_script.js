var previouslyCreatedRoutines;
var executionIndicatorsList = [];
var totalDefinedEiCount = 0;
var previousEICount = 0;

getExecutionIndicators();
getPreviouslyCreatedRoutinesFromSession();

document.getElementById('nextBtn').className = document.getElementById('nextBtn').className.replace(" disabled", ""); 

if(executionIndicatorsList[previouslyCreatedRoutines.length-1].length == 0){
    document.getElementById('nextBtn').className += " disabled";
} 


function getExecutionIndicators(){
    executionIndicatorsList = document.getElementById("execution-indicators").getAttribute("data-execution-indicators");

    executionIndicatorsList = executionIndicatorsList.replaceAll("['", '["');
    executionIndicatorsList = executionIndicatorsList.replaceAll("',", '",');
    executionIndicatorsList = executionIndicatorsList.replaceAll(" '", ' "');
    executionIndicatorsList = executionIndicatorsList.replaceAll("']", '"]');
    executionIndicatorsList = executionIndicatorsList.replaceAll("'", "\'");

    executionIndicatorsList = JSON.parse(executionIndicatorsList);

    // console.log("ALL EIIIII: " + executionIndicatorsList.length);

    // for (let i = 0; i < executionIndicatorsList.length; i++) {
    //     console.log("EI's: " + " " + executionIndicatorsList[i][0] + " -> " + executionIndicatorsList[i][1]);
    // }

    previousEICount = executionIndicatorsList.length;
    totalDefinedEiCount = executionIndicatorsList.length * 5;

    if(executionIndicatorsList.length > 0) {
        setPreviouslySelectedExecutionIndicators();
    }
    // console.log("INSIDE getEI");
}


function setPreviouslySelectedExecutionIndicators(){
    for (let i = 1; i < executionIndicatorsList.length+1 ; i++) {
        for (let j = 1; j < 6; j++) {
            var eiName = "select[name=ei-" + j + "-routine-" + i + "]";
            $(eiName).val(executionIndicatorsList[i-1][j-1]);
        } 
    }
}


function getPreviouslyCreatedRoutinesFromSession(){
    previouslyCreatedRoutines = document.getElementById("created-routines").getAttribute("data-created-routines");

    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("['", '["');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("',", '",');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll(" '", ' "');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("']", '"]');
    previouslyCreatedRoutines = previouslyCreatedRoutines.replaceAll("'", "\'");

    // console.log("######## prev" + previouslyCreatedRoutines);
    previouslyCreatedRoutines = JSON.parse(previouslyCreatedRoutines);

    if(previousEICount == previouslyCreatedRoutines.length)
        document.getElementById('nextBtn').className = document.getElementById('nextBtn').className.replace(" disabled", "");

    for(let i=previousEICount; i<previouslyCreatedRoutines.length+1; i++)
        executionIndicatorsList.push([]);
    
}


for (let i = 1; i < previouslyCreatedRoutines.length + 1; i++) {
    for (let j = 1; j < 6; j++) {
        var eiId = "#ei-" + j + "-routine-" + i;
        $(eiId).on('click',function() {
            if($(this).val() != null){

                if(executionIndicatorsList[i-1][j-1] == undefined){
                    totalDefinedEiCount += 1;
                    
                    if(totalDefinedEiCount ==  previouslyCreatedRoutines.length * 5 && executionIndicatorsList[previouslyCreatedRoutines.length-1].length > 0){
                        document.getElementById('nextBtn').className = document.getElementById('nextBtn').className.replace(" disabled", ""); 
                    }
                }
                
                executionIndicatorsList[i-1][j-1] = $(this).val();

            }
        });
    }
}


$('#nextBtn').click(function(){
    var url, eiData = {};
    
    url = "/home/create/execution-indicators";

    for (let i = 0; i < executionIndicatorsList.length; i++) {
        var singleEi={};
        for(let j=0; j<5; j++){
            singleEi[j] = executionIndicatorsList[i][j];
        }

        eiData[i] = singleEi;
        // console.log("INSIDEEEE: " + eiData[i]);
    }

    $.ajax(
        {
            type:"POST",
            url: url,
            headers:{'X-CSRFToken':$("input[name='csrfmiddlewaretoken']").val()},
            data: {
                execution_indicators: eiData
            },
            success: function() 
            {   
                console.log("successssssssss");
                window.location.href = "/home/create/confirmation";
            }
        }
    );
    
});