$(document).ready(function() {
   
    handleTokenValidation();
    setupLogoutHandler();
    initializeReportsChart("#heartRateChart");
    
   
    populateSelectDeviceId();
    handleFormSubmit();
    handleResetSimulationButton();
});


function handleResetSimulationButton() {
    $('#resetSimulationButton').on('click', function() {
        $('#simulationHeartRateChart').hide();
        $('#resetSimulationButton').hide();
        $('.form-container').show();
        clearFields();
    });
}
function populateSelectDeviceId() {
  
    const token = window.sessionStorage.getItem('patient-token');
    
    $.aja***REMOVED***({
        url: '/patients/profile',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ token }),
        dataType: 'json',
    }).done(function(serverResponse) {
        displaySelectDeviceId(serverResponse);
    }).fail(function(err) {
        console.error('Error fetching device list:', err);
        // Handle the error appropriately
        alert('Error ' + err.status + ' fetching device list: ' + JSON.stringify(err));
    });
}

function displaySelectDeviceId(serverResponse) {
    const selectDeviceId = $('#deviceId');
    selectDeviceId.empty();
    selectDeviceId.append('<option value="">Select Device ID</option>');
    const deviceList = serverResponse.patientProfile.devices;
    for (let i = 0; i < deviceList.length; i++) {
        const deviceOption = `<option value="${deviceList[i]}">${deviceList[i]}</option>`;
        selectDeviceId.append(deviceOption);
    }
}


function clearFields() {
    // $('#resetSimmulationButton').on('click', function() {
        $('#deviceId').val('').focus();
        $('#startDate').val('');
        $('#endDate').val('');
        $('#interval').val('');
        clearErrorMessage();

    // });
}

function handleFormSubmit(event) {
    $('#startSimulationButton').on('click', function(event) {
        event.preventDefault();

        $('.form-container').hide();
        $('#simulationHeartRateChart').show();
        $('#resetSimulationButton').show();
        initializeReportsChart("#simulationHeartRateChart");

    });
        
    // $('#dataForm').on('submit', function(event) {
    //     event.preventDefault();
    //     const deviceId = $('#deviceId').val();
    //     const startDate = $('#startDate').val();
    //     const endDate = $('#endDate').val();
    //     const interval = $('#interval').val();

    //     if (checkFieldsForErrors(deviceId, startDate, endDate, interval)) {
    //         generateAndSendData(deviceId, new Date(startDate), new Date(endDate), parseInt(interval));
    //         console.log('Form submitted');
    //     }
    // });
}

function checkFieldsForErrors(deviceId, startDate, endDate, interval) {
    if (!deviceId) {
        displayErrorMessage('Device ID is required', '#deviceId');
        return false;
    }

    if (!startDate) {
        displayErrorMessage('Start date is required', '#startDate');
        return false;
    }

    if (!endDate) {
        displayErrorMessage('End date is required', '#endDate');
        return false;
    }

    if (!interval) {
        displayErrorMessage('Interval is required', '#interval');
        return false;
    }

    return true;
}

function generateAndSendData(deviceId, startDate, endDate, interval) {
    let currentTime = startDate;
    let successCount = 0;
    let totalCount = 0;
    clearErrorMessage();
    while (currentTime <= endDate) {
        totalCount++;
        const heartrate = generateRandomValue(40, 190);
        const spo2 = generateRandomValue(90, 100);

        const data = {
            event: "sensorData",
            data: JSON.stringify({
                heartrate: heartrate,
                spo2: spo2,
                measurementTime: currentTime.toISOString()
            }),
            coreid: deviceId,
            published_at: new Date().toISOString(),
            test: true
        };

        sendSensorData(data, function() {
            successCount++;
            if (successCount === totalCount) {
                // display graph
            }
        });

        currentTime = new Date(currentTime.getTime() + interval * 60000);
    }
}

function clearErrorMessage() {
    $('.errorDiv').hide();
}

function generateRandomValue(min, ma***REMOVED***) {
    return Math.floor(Math.random() * (ma***REMOVED*** - min + 1) + min);
}

// Function to send sensor data using jQuery AJAX
function sendSensorData(data, callback) {
    $.aja***REMOVED***({
        url: '/iot/send-datastore',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        headers: { '***REMOVED***-api-key': 'API_KEY'},
        success: function(response) {
            console.log('Success:', response);
            if (callback) callback();
        },
        error: function(error) {
            alert('An error occurred while sending data. Error = ' + error);
            console.error('Error:', error);
        }
    });
}

function displayErrorMessage(message, selector) {
    var errorMessageHtml = "<ul><li class='errorMessage'>" + message + "</li></ul>";
    $('.errorDiv').html(errorMessageHtml);
    $('.errorDiv').show();
    $(selector).focus();
}

function initializeReportsChart(target) {
    new Ape***REMOVED***Charts(document.querySelector(target), {
        series: [{
            name: 'Sales',
            data: [31, 40, 28, 51, 42, 82, 56],
        }, {
            name: 'Revenue',
            data: [11, 32, 45, 32, 34, 52, 41]
        }, {
            name: 'Customers',
            data: [15, 11, 32, 18, 9, 24, 11]
        }],
        chart: {
            height: 350,
            type: 'area',
            toolbar: {
                show: false
            },
        },
        markers: {
            size: 4
        },
        colors: ['#4154f1', '#2eca6a', '#ff771d'],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.4,
                stops: [0, 90, 100]
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        ***REMOVED***a***REMOVED***is: {
            type: 'datetime',
            categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
        tooltip: {
            ***REMOVED***: {
                format: 'dd/MM/yy HH:mm'
            },
        }
    }).render();

    new Ape***REMOVED***Charts(document.querySelector("#bloodO***REMOVED***ygenChart"), {
        series: [{
            name: 'O***REMOVED***ygen Levels',
            data: [95, 96, 97, 98, 99, 100, 99],
        }],
        chart: {
            height: 350,
            type: 'area',
            toolbar: {
                show: false
            },
        },
        markers: {
            size: 4
        },
        colors: ['#2eca6a'],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.4,
                stops: [0, 90, 100]
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        ***REMOVED***a***REMOVED***is: {
            type: 'datetime',
            categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
        tooltip: {
            ***REMOVED***: {
                format: 'dd/MM/yy HH:mm'
            },
        }
    }).render();
}

function handleTokenValidation() {
    const localStorageToken = window.localStorage.getItem('patient-token');
    let sessionToken = window.sessionStorage.getItem('patient-token');

    if (localStorageToken && !sessionToken) {
        window.sessionStorage.setItem('patient-token', localStorageToken);
        sessionToken = localStorageToken;
    }

    if (!sessionToken && !localStorageToken) {
        redirectToHomePage();
    } else {
        validateTokenWithServer(sessionToken);
    }
}

function redirectToHomePage() {
    window.location.href = '/home.html';
}

function validateTokenWithServer(token) {
    $.aja***REMOVED***({
        url: '/patients/token-auth',
        method: 'GET',
        contentType: 'application/json',
        headers: {'***REMOVED***-auth': token},
        dataType: 'json',
    }).done(function(data) {
        document.body.classList.remove('hidden');
        getPatientProfile(token);
    }).fail(function(err) {
        handleTokenValidationError();
    });
}

function handleTokenValidationError() {
    window.localStorage.removeItem('patient-token');
    redirectToHomePage();
}

function setupLogoutHandler() {
    $('.logout').on('click', function(event){
        event.preventDefault();
        window.sessionStorage.removeItem("patient-token");
        window.localStorage.removeItem("patient-token");
        document.body.classList.add('hidden');
        redirectToHomePage();
    });
}

function getPatientProfile(token) {
    $.aja***REMOVED***({
        url: '/patients/profile',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ token: token }),
        dataType: 'json',
    })
    .done(function(serverResponse) {
        const patient = serverResponse.patientProfile;
        displayPatientProfile(patient);
    })
    .fail(function(err) {
        console.log('Error:', err);
    });
}

function displayPatientProfile(patient) {
    const patientFullName = `${patient.firstName} ${patient.lastName}`;
    $('.patientFullName').te***REMOVED***t(patientFullName);
}