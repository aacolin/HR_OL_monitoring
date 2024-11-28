$(document).ready(function() {
    // Target the button inside #chart
    $('#chart input[type="button"]').on('click', function(event) {
        alert('button clicked');
        console.log("button clicked");
        drawGraph();
        /*$.aja***REMOVED***({
            url: '/sensor/data',
            method: 'GET',
            contentType: 'application/json',
            //data: credentialsInJSON,
            dataType: 'json',
        }).done(function(data) {
            if ($('#rememberMe').checked) {
                window.localStorage.setItem('patient-token', data.patientToken);
            }
            window.location.href = '/home.html';
        }).fail(function(err){
            errorMessages.push(err.responseJSON.message);
            displayErrorMessages(errorMessages);
        });*/
    });
});
var ***REMOVED***yValues = [
    {***REMOVED***:0, y:0},
    {***REMOVED***:60, y:8},
    {***REMOVED***:70, y:8},
    {***REMOVED***:80, y:9},
    {***REMOVED***:90, y:9},
    {***REMOVED***:100, y:9},
    {***REMOVED***:110, y:10},
    {***REMOVED***:120, y:11},
    {***REMOVED***:130, y:14},
    {***REMOVED***:140, y:14},
    {***REMOVED***:150, y:15}
  ];



function drawGraph() {
    new Chart("myChart", {
      type: "scatter",
      data: {
        datasets: [{
          pointRadius: 4,
          pointBackgroundColor: "rgb(0,0,255)",
          data: ***REMOVED***yValues
        }]
      },
      options: {
        legend: {display: true},
        scales: {
          ***REMOVED***A***REMOVED***es: [{ticks: {min: 40, ma***REMOVED***:160}}],
          yA***REMOVED***es: [{ticks: {min: 0, ma***REMOVED***:255}}],
        }
      }
  });
  
  }