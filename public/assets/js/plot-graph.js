

function drawGraph(){
    //alert('button clicked');
    const deviceId = "johndoedevice123";
    //console.log("button clicked");
    //  drawGraph();
    $.aja***REMOVED***({
        url: `sensor/plotData?deviceId=${deviceId}`,
        method: 'GET',
        contentType: 'application/json',
        //data: credentialsInJSON,
        dataType: 'json',
    })
    .done(function(data) {
        // console.log('getting dta', JSON.stringify(data, null, 2));
         // Process the data into the format needed for the graph
         const heartRateDataR***REMOVED*** = data[0].events.map(entry => ({
            SPO2 : entry.SpO2,// Time as ***REMOVED***-a***REMOVED***is
            heartRate: entry.heartRate // SpO2 data as y-a***REMOVED***is
        }));
        heartRateDataR***REMOVED***.forEach(entry => {
            console.log('SPO2:', entry.SPO2, 'hearRate:', entry.heartRate);  // Log each ***REMOVED*** and y value
        });
    })
    
    .fail(function(err){
        errorMessages.push(err.responseJSON.message);
        displayErrorMessages(errorMessages);
    });
}



$(function() {
    $('#showAllData').click(drawGraph);
    
});