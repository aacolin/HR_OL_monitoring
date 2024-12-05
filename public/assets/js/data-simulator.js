$(document).ready(function() {
    handleFormSubmit();
    handleCancelButtonClick();
    populateSelectDeviceId();
});

function populateSelectDeviceId() {
    
}

function handleCancelButtonClick() {
    $('#cancelButton').on('click', function() {
        $('#deviceId').val('').focus();
        $('#startDate').val('');
        $('#endDate').val('');
        $('#interval').val('');
        clearErrorMessage();

    });
}

function handleFormSubmit(event) {
    $('#dataForm').on('submit', function(event) {
        event.preventDefault();
        const deviceId = $('#deviceId').val();
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
        const interval = $('#interval').val();

        if (checkFieldsForErrors(deviceId, startDate, endDate, interval)) {
            generateAndSendData(deviceId, new Date(startDate), new Date(endDate), parseInt(interval));
            console.log('Form submitted');
        }
    });
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