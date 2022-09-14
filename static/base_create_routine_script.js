var currentTab = 0; 
showTab(currentTab); 
const pageNo = document.getElementById("page-number").getAttribute("data-page-number");
console.log("page no: ", pageNo);

showButton();


function showTab(n) {  
    var x = document.getElementsByClassName("step");
    console.log("length: ", x.length )
    x[n].style.display = "block";

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

    fixStepIndicator(n)
}


function nextPrev(n) {
    var x = document.getElementsByClassName("step");
    if (n == 1 && !validateForm()) return false;
    x[currentTab].style.display = "none";
    currentTab = currentTab + n;

    if (currentTab >= x.length) {
        document.getElementById("signUpForm").submit();
        return false;
    }

    showTab(currentTab);
}

function validateForm() {
    var x, y, i, valid = true;
    x = document.getElementsByClassName("step");
    y = x[currentTab].getElementsByTagName("input");
    
    for (i = 0; i < y.length; i++) {
        if (y[i].value == "") {
            y[i].className += " invalid";
            valid = false;
        }
    }

    if (valid) {
        document.getElementsByClassName("stepIndicator")[currentTab].className += " finish";
    }

    return valid; 

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
        console.log("this is page 1");

    } else if( pageNo == 2){
        document.getElementById("prevBtn").href = "/home/create/select-device";

    } else if( pageNo == 3){
        document.getElementById("nextBtn").href = "/home/create/execution-indicators";
        document.getElementById("prevBtn").href = "/home/create/routine";

    } else if( pageNo == 4){
        // document.getElementById("nextBtn").href = "/home/create/confirmation";
        document.getElementById("prevBtn").href = "/home/create/edit-delete-routine";
        
    } else {
        document.getElementById("nextBtn").href = "/home/create/complete";
        document.getElementById("prevBtn").href = "/home/create/execution-indicators";
    }

    fixStepIndicator(pageNo-1);

}


function fixStepIndicator(n) {
    var i, x = document.getElementsByClassName("stepIndicator");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }

    for(i=0; i< n+1; i++){
        x[i].className += " active";
    }
    
}
