
var currentSearchType = $("#btn-group input[type='radio']:checked").val();
document.getElementById("search-type").value = currentSearchType;
console.log("Hello from search" + currentSearchType);
console.log("Hell search 2: " + document.getElementById("search-type").value);


$('#btn-group').on('change', function() {
    currentSearchType = $("#btn-group input[type='radio']:checked").val();
    document.getElementById("search-type").value = currentSearchType;
    console.log("CurSel:" + currentSearchType + " | " + document.getElementById("search-type").value);
});


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


