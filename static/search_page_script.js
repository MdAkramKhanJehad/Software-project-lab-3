var currentSearchType = $("#btn-group input[type='radio']:checked").val();
document.getElementById("search-type").value = currentSearchType;
console.log("Hello from search" + currentSearchType);
console.log("Hell search 2: " + document.getElementById("search-type").value);


function getSearchResult(){
    var searchResult = document.getElementById("created-routines").getAttribute("data-search-results");
   
    searchResult = searchResult.replaceAll("['", '["');
    searchResult = searchResult.replaceAll("',", '",');
    searchResult = searchResult.replaceAll(" '", ' "');
    searchResult = searchResult.replaceAll("']", '"]');
    searchResult = searchResult.replaceAll("'", "\'");

    searchResult = JSON.parse(searchResult);

    console.log("Length:" + searchResult.length);
    return searchResult;
}


$('#btn-group').on('change', function() {
    currentSearchType = $("#btn-group input[type='radio']:checked").val();
    document.getElementById("search-type").value = currentSearchType;
    console.log("CurSel:" + currentSearchType + " | " + document.getElementById("search-type").value);
});


// function downloadObjectAsJson(){
//     var searchResult = getSearchResult();

//     var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(searchResult));
//     var downloadAnchorNode = document.createElement('a');
//     downloadAnchorNode.setAttribute("href", dataStr);
//     downloadAnchorNode.setAttribute("download", "routines.json");
//     document.body.appendChild(downloadAnchorNode); // required for firefox
//     downloadAnchorNode.click();
//     downloadAnchorNode.remove();
// }


// function searchRoutine(){
//     var searchQuery = document.getElementById("query").value;
//     var url = "/home/search/search-routine";
//     console.log("SEARCH:" + searchQuery);
//     console.log("SEARCH TYPE:" + currentSearchType);

//     $.ajax(
//         {
//             type:"POST",
//             url: url,
//             headers:{'X-CSRFToken':$("input[name='csrfmiddlewaretoken']").val()},
//             contentType: 'application/json',
//             data: {
//                 query: searchQuery,
//                 currentSearchType: currentSearchType
//             },
//             success: function() 
//             {   
//                 console.log("successssssssss");
//                 window.location.href = url;
//             }
//         }
//     );
// }


