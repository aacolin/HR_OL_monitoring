var particleAccessToken = PERTICLE_ACCESS_TOKEN; // process.env.PARTICLE_ACCESS_TOKEN;
var particleUserName = PARTICLE_ACCOUNT_USERNAME; //process.env.PARTICLE_USERNAME;
var particlePassword =PARTICLE_ACCOUNT_PASSWORD;          // process.env.PARTICLE_PASSWORD;
var particleClientId = "particle"        	 //process.env.PARTICLE_CLIENT_ID;
var particleClientSecret ="particle";		 //  process.env.PARTICLE_CLIENT_SECRET;


function drawGraph(){
    //alert('button clicked');
    const iotDeviceId = "johndoedevice123";
    //console.log("button clicked");
    //  drawGraph();
    $.aja***REMOVED***({
        url: `sensor/plotData?iotDeviceId=${iotDeviceId}`,
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

// generate range for start of week, month 
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
	alert('patientGraph');
    // const rangeType = document.getElementById('timePeriod').value;
    // const iotDeviceId = document.getElementById('iotDeviceId').value;
    // const now = new Date();
    // // console.log("Calculating Range for " + rangeType);
    // const {startDate, endDate} = getDateRanges(rangeType);

    // //fetch(`sensor/getDataByTimePeriod?startDate=${startDate}&endDate=${endDate}&iotDeviceId=${iotDeviceId}`)
    // if( rangeType === 'weekly' || rangeType === 'monthly'){
    //   weekelyMonthly(startDate, endDate, rangeType);
    // }
    // else {
    //     const aDay = new Date().toISOString(); // UTC time in ISO format

    //     dailyFetch(rangeType, aDay, iotDeviceId);
    // }
}


// daily catuture
function dailyFetch(rangeType, aDay,  iotDeviceId){
  if (iotDeviceId ===""){ alert ('Please enter a valid device ID'); return;}
  console.log("received daily" + aDay + " " +  rangeType);
  fetch(`sensor/usrDayLog?aDay=${aDay}&iotDeviceId=${iotDeviceId}`)
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

// function to capture montly or weekly graph
function weekelyMonthly(startDate, endDate, rangeType){
  console.log("received montly and weekely" + startDate + " " +  endDate);
  fetch(`sensor/usrMonthlyLogs?startDate=${startDate}&endDate=${endDate}&iotDeviceId=${iotDeviceId}`)
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


// iot API call to change sampling frequency
function changeIOTSamplingFreq(){
	// alert('Change Sampling frequency button clicked');
	const samplingTime  = document.getElementById('samplingFreq').value;
        const iotDeviceId = document.getElementById('iotDeviceId').value;
	
	console.log("device ID received" + iotDeviceId);
	console.log("received sampling time in minutes"+ samplingTime);
	
	if (iotDeviceId.trim() === ""){ alert ('Please enter a valid device ID'); return;}
        if (samplingTime === "" || samplingTime=== "0"){ alert ('Please enter a Non Zero Sampling Time Interval '); return;}

	functionName = "meas_period";
	// Construct the request body with the access token and the string to send
	const requestBody = new URLSearchParams({
		access_token: particleAccessToken,  // Include the access token for authentication
		arg1:samplingTime,                 // Send the string as the first argument
	});

	// Send the POST request to the Particle Cloud API
	fetch(`https://api.particle.io/v1/devices/${iotDeviceId}/${functionName}`, {
		method: 'POST',
		body: requestBody,  // Attach the request body with the parameters
	})
		.then(response => response.json())
		.then(data => {
			if (data.ok) {
				console.log('Successfully posted data to Particle Cloud:', data);
			} else {
				console.error('Error posting data to Particle Cloud:', data);
			}
		})
		.catch(error => {
			console.error('Error during fetch:', error);
		});
}


// iot api call to change start time of the day
function changeSamplingStartTime(){
	// alert(' start time button clicked');
	const startSamplingTime  = document.getElementById('startSamplingTime').value;
        const iotDeviceId = document.getElementById('iotDeviceId').value;

	console.log("Received Sampling Start Time"+ startSamplingTime);
        
	if (iotDeviceId ===""){ alert ('Please enter a valid device ID'); return;}
        if (startSamplingTime=== "" || startSamplingTime=== "0"){ alert ('Please enter a Non Zero Start  Time'); return;}

	functionName = "set_start_time";
	// Construct the request body with the access token and the string to send
	const requestBody = new URLSearchParams({
		access_token: particleAccessToken,  // Include the access token for authentication
		arg1:startSamplingTime,                 // Send the string as the first argument
	});

	// Send the POST request to the Particle Cloud API
	fetch(`https://api.particle.io/v1/devices/${iotDeviceId}/${functionName}`, {
		method: 'POST',
		body: requestBody,  // Attach the request body with the parameters
	})
		.then(response => response.json())
		.then(data => {
			if (data.ok) {
				console.log('Successfully posted data to Particle Cloud:', data);
			} else {
				console.error('Error posting data to Particle Cloud:', data);
			}
		})
		.catch(error => {
			console.error('Error during fetch:', error);
		});
}

// iot api call to change stop  time of the day
function changeStopSamplingTime(){
// 	alert('Stop Time btn clicked');
	const stopSamplingTime  = document.getElementById('stopSamplingTime').value;
        const iotDeviceId = document.getElementById('iotDeviceId').value;

	if (iotDeviceId ===""){ alert ('Please enter a valid device ID'); return;}
        if (stopSamplingTime==="" || stopSamplingTime==="0"){ alert ('Please enter a Non Zero Stop Time'); return;}
	
	console.log("Received Sampling STop Time"+ stopSamplingTime);
	functionName = "set_end_time";
	// Construct the request body with the access token and the string to send
	const requestBody = new URLSearchParams({
		access_token: particleAccessToken,  // Include the access token for authentication
		arg1:stopSamplingTime,                 // Send the string as the first argument
	});

	// Send the POST request to the Particle Cloud API
	fetch(`https://api.particle.io/v1/devices/${iotDeviceId}/${functionName}`, {
		method: 'POST',
		body: requestBody,  // Attach the request body with the parameters
	})
		.then(response => response.json())
		.then(data => {
			if (data.ok) {
				console.log('Successfully posted data to Particle Cloud:', data);
				// alert('Successfully posted Stop Time to Particle Cloud:', data);  doesn't instantly responds ok gives timeout 
			} else {
				console.error('Error posting data to Particle Cloud:', data);
				//alert('Stop Time Post to  Particle Cloud is not successful:', data);
			}
		})
		.catch(error => {
			console.error('Error during fetch:', error);
		});
}


// DOM Ready function, event listenters
 $(function() {
     $('#showAllDataBtn').click(drawGraph);
     $('#changeSamplingStartTimeBtn').click(changeSamplingStartTime);
     $('#plotPatientGraphBtn').click(showPatientGraph);
     $('#changeSamplingFreqBtn').click(changeIOTSamplingFreq);
     $('#changeStopSamplingTimeBtn').click(changeStopSamplingTime);
 });

