

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
            y: entry.heartRate, // SpO2 data as y-a***REMOVED***is
            ***REMOVED*** : new Date(entry.eventPublishedTime) //new Date().toLocaleTimeString()  // Format: "HH:MM:SS AM/PM"
        }));

        const spo2DataR***REMOVED*** = data[0].events.map(entry => ({
            y : entry.SpO2,// Time as ***REMOVED***-a***REMOVED***is
            ***REMOVED*** : new Date(entry.eventPublishedTime) //new Date().toLocaleTimeString()  // Format: "HH:MM:SS AM/PM"
        }));

        heartRateDataR***REMOVED***.forEach(entry => {
            console.log('hearRate:', entry.***REMOVED***, 'publishedTime :', entry.y);  // Log each ***REMOVED*** and y value
        });

        spo2DataR***REMOVED***.forEach(entry => {
            console.log('SPO2:', entry.***REMOVED***, 'publishedTime :', entry.y);  // Log each ***REMOVED*** and y value
        });

 // Create heart rate chart (scatter chart)
 const heartRateCt***REMOVED*** = document.getElementById('heartRateChart').getConte***REMOVED***t('2d');
 const heartRateChart = new Chart(heartRateCt***REMOVED***, {
   type: 'scatter',
   data: {
     datasets: [{
       pointRadius: 1,
       label: 'Heart Rate (BPM)',
       pointBackgroundColor: "rgb(0,0,255)",
       data: heartRateDataR***REMOVED***
     }]
   },
   options: {
    responsive: true,
    scales: {
      ***REMOVED***: {
        type: 'time',  // Time scale for the X-a***REMOVED***is
        time: {
          unit: 'minute',  // Set unit to minute
          stepSize: 60,  // Step size of 1 hour (60 minutes)
          displayFormats: {
            minute: 'H:mm'  // Display format for the X-a***REMOVED***is labels
          },
          tooltipFormat: 'll HH:mm',  // Tooltip format to show full date and time
        },
        ticks: {
          min: '2024-12-05T00:00:00',  // Start of the day (midnight)
          ma***REMOVED***: '2024-12-05T23:59:59',  // End of the day (just before midnight)
          source: 'data',  // Get ticks from the data
        },
        title: {
          display: true,
          te***REMOVED***t: 'Time of Day'
        }
      },
      y: {
        title: {
          display: true,
          te***REMOVED***t: 'Value'  // This could be heart rate, SpO2, etc.
        },
        min: 50,  // Adjust as needed
        ma***REMOVED***: 100,  // Adjust as needed
      }
    }
  }
 });

    })
    
    .fail(function(err){
        errorMessages.push(err.responseJSON.message);
        displayErrorMessages(errorMessages);
    });
}
var timePeriodVar={
    startDate:  '',
    endDate: ''
};

function getDateRanges(rangeType) {
    const now = new Date();
    console.log("Calculating Range for " + rangeType);
    var startDate, endDate;

    if (rangeType === 'daily') {
        // For a single day
        startDate = new Date(now.setHours(0, 0, 0, 0)); // Start of today
        endDate = new Date(now.setHours(23, 59, 59, 999)); // End of today
    } else if (rangeType === 'weekly') {
        // Get the start of the current week (Sunday)
        const firstDayOfWeek = now.getDate() - now.getDay(); // Adjust to Sunday
        startDate = new Date(now.setDate(firstDayOfWeek));
        startDate.setHours(0, 0, 0, 0); // Start of the week
        // End of the week (Saturday)
        endDate = new Date(now.setDate(firstDayOfWeek + 6));
        endDate.setHours(23, 59, 59, 999); // End of the week
    } else if (rangeType === 'monthly') {
        // Start of the current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the month
        startDate.setHours(0, 0, 0, 0); // Start of the month
        // End of the current month
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the month
        endDate.setHours(23, 59, 59, 999); // End of the month
    }
//    console.log("start Date :" + startDate + " endDate : " + endDate);
    return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
}

function showPatientGraph() {
    const rangeType = document.getElementById('timePeriod').value;
    const deviceId = document.getElementById('deviceId').value;
    const now = new Date();
    // console.log("Calculating Range for " + rangeType);
    const {startDate, endDate} = getDateRanges(rangeType);

    //fetch(`sensor/getDataByTimePeriod?startDate=${startDate}&endDate=${endDate}&deviceId=${deviceId}`)
    if( rangeType === 'weekly' || rangeType === 'monthly'){
      weekelyMonthly(startDate, endDate, rangeType);
    }
    else {
        const aDay = new Date().toISOString(); // UTC time in ISO format

        dailyFetch(rangeType, aDay, deviceId);
    }
}

function dailyFetch(rangeType, aDay,  deviceId){
  console.log("received daily" + aDay + " " +  rangeType);
  // const DEC_FIRST_WK = "2024-12-08T07:00:00.000Z";
  // const MONTHLY_QUERY = fetch(`sensor/usrLogs?startDate=${startDate}&endDate=${endDate}&deviceId=${deviceId}`)`sensor/usrLogs?startDate=${startDate}&endDate=${endDate}&deviceId=${deviceId}`
  // rangeType === 'monthly'){fetch(`sensor/usrLogs?startDate=${startDate}&endDate=${endDate}&deviceId=${deviceId}`)}
  // else{fetch(`sensor/usrLogs?startDate=${DEC_FIRST_WK}&endDate=${endDate}&deviceId=${deviceId}`)}
  fetch(`sensor/usrDayLog?aDay=${aDay}&deviceId=${deviceId}`)
  .then(response => response.json())
  .then(data => {
   if (Array.isArray(data) && data.length > 0) {
      const heartRateDataR***REMOVED*** = data[0].events.map(entry => ({
           y: entry.heartRate, // SpO2 data as y-a***REMOVED***is
           ***REMOVED*** : new Date(entry.published_at).toISOString() //.toLocaleTimeString() //new Date().toLocaleTimeString()  // Format: "HH:MM:SS AM/PM"
      }));
    
      const spo2DataR***REMOVED*** = data[0].events.map(entry => ({
          y : entry.SpO2,// Time as ***REMOVED***-a***REMOVED***is
          ***REMOVED*** : new Date(entry.published_at).toISOString() // ocaleTimeString()  // Format: "HH:MM:SS AM/PM"
      }));
    
      heartRateDataR***REMOVED***.forEach(entry => {
          console.log('hearRate:', entry.y, 'publishedTime :', entry.***REMOVED***);  // Log each ***REMOVED*** and y value
      });
    
      // Destroy e***REMOVED***isting charts if e***REMOVED***ists
      let heartRateChartStatus = Chart.getChart("heartRateChart");
      if (heartRateChartStatus != undefined) {
        heartRateChartStatus.destroy();
      }
    
      let SpO2ChartStatus = Chart.getChart("SpO2Chart");
      if (SpO2ChartStatus != undefined) {
        SpO2ChartStatus.destroy();
      }
    
      // Create the Heart Rate chart
      const heartRateCt***REMOVED*** = document.getElementById('heartRateChart').getConte***REMOVED***t('2d');
      new Chart(heartRateCt***REMOVED***, {
        type: 'scatter',
        data: {
            //          labels: timestamps,
          datasets: [
            {
              label: 'Heart Rate',
              data: heartRateDataR***REMOVED***.map((value, inde***REMOVED***) => ({ ***REMOVED***: heartRateDataR***REMOVED***[inde***REMOVED***], y: value })),
              borderColor: 'red',
              fill: false,
              showLine: true,
            },
          ],
        },
      });
    
        // Create the SpO2 chart
      const SpO2Ct***REMOVED*** = document.getElementById('SpO2Chart').getConte***REMOVED***t('2d');
      new Chart(SpO2Ct***REMOVED***, {
        type: 'scatter',
        data: {
        //              labels: timestamps,
          datasets: [
            {
              label: 'SpO2',
              data:  spo2DataR***REMOVED***.map((value, inde***REMOVED***) => ({ ***REMOVED***:spo2DataR***REMOVED***[inde***REMOVED***], y: value })),
              borderColor: 'blue',
              fill: false,
              showLine: true,
            },
          ],
        },
        options: {
            scales: {
              ***REMOVED***: {
                type: 'time',  // Use time scale for the ***REMOVED***-a***REMOVED***is
                time: {
                  unit: 'minute',  // Set the unit to 'minute' for the ***REMOVED***-a***REMOVED***is
                  stepSize: 30,    // Set the step size to 30 minutes (this is in minutes)
                  tooltipFormat: 'll HH:mm', // Formatting the tooltip
                },
                ticks: {
                  autoSkip: true,  // Skip labels if there are too many
                },
              },
              y: {
                ticks: {
                  stepSize: 10,  // Set the step size for the y-a***REMOVED***is to 10
                },
              },
            },
        },
      });
    } else { console.log("No Data Received or Not an Array");}
  }) 
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}


function weekelyMonthly(startDate, endDate, rangeType){
  console.log("received montly and weekely" + startDate + " " +  endDate);
  // const DEC_FIRST_WK = "2024-12-08T07:00:00.000Z";
  // const MONTHLY_QUERY = fetch(`sensor/usrLogs?startDate=${startDate}&endDate=${endDate}&deviceId=${deviceId}`)`sensor/usrLogs?startDate=${startDate}&endDate=${endDate}&deviceId=${deviceId}`
  // rangeType === 'monthly'){fetch(`sensor/usrLogs?startDate=${startDate}&endDate=${endDate}&deviceId=${deviceId}`)}
  // else{fetch(`sensor/usrLogs?startDate=${DEC_FIRST_WK}&endDate=${endDate}&deviceId=${deviceId}`)}
  fetch(`sensor/usrMonthlyLogs?startDate=${startDate}&endDate=${endDate}&deviceId=${deviceId}`)
  .then(response => response.json())
  .then(data => {
   if (Array.isArray(data) && data.length > 0) {
      const heartRateDataR***REMOVED*** = data[0].events.map(entry => ({
           y: entry.heartRate, // SpO2 data as y-a***REMOVED***is
           ***REMOVED*** : new Date(entry.published_at).toISOString() //.toLocaleTimeString() //new Date().toLocaleTimeString()  // Format: "HH:MM:SS AM/PM"
      }));
    
      const spo2DataR***REMOVED*** = data[0].events.map(entry => ({
          y : entry.SpO2,// Time as ***REMOVED***-a***REMOVED***is
          ***REMOVED*** : new Date(entry.published_at).toISOString() // ocaleTimeString()  // Format: "HH:MM:SS AM/PM"
      }));
    
      heartRateDataR***REMOVED***.forEach(entry => {
          console.log('hearRate:', entry.y, 'publishedTime :', entry.***REMOVED***);  // Log each ***REMOVED*** and y value
      });
    
      // Destroy e***REMOVED***isting charts if e***REMOVED***ists
      let heartRateChartStatus = Chart.getChart("heartRateChart");
      if (heartRateChartStatus != undefined) {
        heartRateChartStatus.destroy();
      }
    
      let SpO2ChartStatus = Chart.getChart("SpO2Chart");
      if (SpO2ChartStatus != undefined) {
        SpO2ChartStatus.destroy();
      }
    
      // Create the Heart Rate chart
      const heartRateCt***REMOVED*** = document.getElementById('heartRateChart').getConte***REMOVED***t('2d');
      new Chart(heartRateCt***REMOVED***, {
        type: 'scatter',
        data: {
            //          labels: timestamps,
          datasets: [
            {
              label: 'Heart Rate',
              data: heartRateDataR***REMOVED***.map((value, inde***REMOVED***) => ({ ***REMOVED***: heartRateDataR***REMOVED***[inde***REMOVED***], y: value })),
              borderColor: 'red',
              fill: false,
              showLine: true,
            },
          ],
        },
      });
    
        // Create the SpO2 chart
      const SpO2Ct***REMOVED*** = document.getElementById('SpO2Chart').getConte***REMOVED***t('2d');
      new Chart(SpO2Ct***REMOVED***, {
        type: 'scatter',
        data: {
        //              labels: timestamps,
          datasets: [
            {
              label: 'SpO2',
              data:  spo2DataR***REMOVED***.map((value, inde***REMOVED***) => ({ ***REMOVED***:spo2DataR***REMOVED***[inde***REMOVED***], y: value })),
              borderColor: 'blue',
              fill: false,
              showLine: true,
            },
          ],
        },
        options: {
            scales: {
              ***REMOVED***: {
                type: 'time',  // Use time scale for the ***REMOVED***-a***REMOVED***is
                time: {
                  unit: 'minute',  // Set the unit to 'minute' for the ***REMOVED***-a***REMOVED***is
                  stepSize: 30,    // Set the step size to 30 minutes (this is in minutes)
                  tooltipFormat: 'll HH:mm', // Formatting the tooltip
                },
                ticks: {
                  autoSkip: true,  // Skip labels if there are too many
                },
              },
              y: {
                ticks: {
                  stepSize: 10,  // Set the step size for the y-a***REMOVED***is to 10
                },
              },
            },
        },
      });
    } else { console.log("No Data Received or Not an Array");}
  }) 
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

$(function() {
    $('#showAllData').click(drawGraph);
    $('#plotPatientGraph').click(showPatientGraph);
    
});
