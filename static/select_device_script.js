var selectedDevices = [];
getSelectedDeviceFromSession();


function getSelectedDeviceFromSession(){
    var selectedDevicesFromSession = document.getElementById("selected-device").getAttribute("data-selected-device");
    console.log("sel dev: ", selectedDevicesFromSession);
    console.log(typeof selectedDevicesFromSession);

    selectedDevicesFromSession = selectedDevicesFromSession.replace(/'/g, '"')
    selectedDevices = JSON.parse(selectedDevicesFromSession);

    for (const selectedDevice of selectedDevices){
        styleChangeAfterSelection(selectedDevice);
    }
}


function selectedCard(device){
    const index = selectedDevices.indexOf(device);
    
    if(index > -1){
        //remove from selected device
        selectedDevices.splice(index, 1);
        styleChangeAfterDeselection(device);
    
    }else {
        //add in selected device
        selectedDevices.push(device);
        styleChangeAfterSelection(device);
    }
    
    console.log("all dev : " + selectedDevices);
}


function styleChangeAfterSelection(device){
    document.getElementById(device).className += " selected";
    console.log(document.getElementById(device).getAttribute('class'));

    document.getElementById(device).style.transform = "scale(1.07)";
    document.getElementById(device).style.boxShadow = "5px 6px 6px 2px #e9ecef";
    document.getElementById(device).style.backgroundColor = "#198754";
    document.getElementById(device).style.color = "white";
    document.getElementById(device).style.borderRadius = "10px";
}


function styleChangeAfterDeselection(device){
    document.getElementById(device).className = document.getElementById(device).className.replace(" selected", "");
    console.log(document.getElementById(device).getAttribute('class'));

    document.getElementById(device).style.transform = "scale(1)";
    document.getElementById(device).style.boxShadow = "none";
    document.getElementById(device).style.backgroundColor = "transparent";
    document.getElementById(device).style.color = "black";
}


$('#nextBtn').click(function(){
    var data, nextBtnUrl, dataDev = {};
    
    nextBtnUrl = "/home/create/select-device";
    data = selectedDevices;
    for (let i = 0; i < selectedDevices.length; i++) {
        dataDev[i] = selectedDevices[i];
    }

    $.ajax(
        {
            type:"POST",
            url: nextBtnUrl,
            headers:{'X-CSRFToken':$("input[name='csrfmiddlewaretoken']").val()},
            data: {
                devices: dataDev
            },
            success: function() 
            {   
                console.log("successssssssss");
                window.location.href = "/home/create/routine";
            }
        }
    );
    
});