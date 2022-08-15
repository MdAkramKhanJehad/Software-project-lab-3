var currentTab = 0; 
showTab(currentTab); 
const pageNo = document.getElementById("page-number").getAttribute("data-page-number");
console.log("page no: ", pageNo);

showButton();


function showTab(n) {
    // This function will display the specified tab of the form...
  
    var x = document.getElementsByClassName("step");
    console.log("length: ", x.length )
    // console.log()
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    //... and run a function that will display the correct step indicator:
    fixStepIndicator(n)
}


function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("step");
    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
    // ... the form gets submitted:
        document.getElementById("signUpForm").submit();
        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName("step");
    y = x[currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
        // add an "invalid" class to the field:
        y[i].className += " invalid";
        // and set the current valid status to false
        valid = false;
    }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
    document.getElementsByClassName("stepIndicator")[currentTab].className += " finish";
    }
    return valid; // return the valid status
}


function showButton(){
    if (pageNo == 1) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }

    if (pageNo == 5) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }

    if(pageNo == 1 ){
        // document.getElementById("nextBtn").href = "/home/create/routine";
        console.log("this is page 1");

    } else if( pageNo == 2){
        document.getElementById("nextBtn").href = "/home/create/edit-delete-routine";
        document.getElementById("prevBtn").href = "/home/create/select-device";

    } else if( pageNo == 3){
        document.getElementById("nextBtn").href = "/home/create/execution-indication";
        document.getElementById("prevBtn").href = "/home/create/routine";

    } else if( pageNo == 4){
        document.getElementById("nextBtn").href = "/home/create/confirmation";
        document.getElementById("prevBtn").href = "/home/create/edit-delete-routine";
        
    } else {
        document.getElementById("nextBtn").href = "/home/create/complete";
        document.getElementById("prevBtn").href = "/home/create/execution-indication";
    }

    fixStepIndicator(pageNo-1);

}


function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("stepIndicator");
    for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    x[n].className += " active";
}
