$(document).ready(function() {
    // generate a new access token in cli by running the following command
    // particle token create --e***REMOVED***pires-in 3600
    // token will be valid for 3600 seconds = 1 hour
    const deviceId = 'DEVICE_ID'; // Replace with your actual device ID
    const accessToken = 'ACCESS_TOKEN'; // Replace with your actual access token
    handleTokenValidation();
    fetchDeviceInfo(deviceId, accessToken);
    setupLogoutHandler();
});


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


function fetchDeviceInfo(deviceId, accessToken) {
    $.aja***REMOVED***({
        url: `https://api.particle.io/v1/devices/${deviceId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .done(handleSuccess)
    .fail(handleError)
    .always(function() {
        console.log('Request completed');
    });
}

function handleSuccess(response) {
    // console.log('Device Info:', response);
    const device = response;
    $('.deviceName').te***REMOVED***t(device.name);
    $('#deviceId').te***REMOVED***t(device.id);
    $('#serialNumber').te***REMOVED***t(device.serial_number);
    $('#firmwareVersion').te***REMOVED***t(device.system_firmware_version);
}

function handleError(err) {
    console.error('Error:', err);
}