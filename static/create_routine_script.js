var currentlyShowing = "state-0";
document.getElementById(currentlyShowing).style.display = "block";


function showAttributes(device){
    document.getElementById(currentlyShowing).style.display = "none";
    
    const device_elememt = document.getElementById(device);
    const index = device_elememt.getAttribute("data-index");
    currentlyShowing = "state-"+index;
    const selected_device = document.getElementById(currentlyShowing)
    selected_device.style.display = "block";
}