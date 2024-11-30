$(document).ready(function() {
    handleTokenValidation();
    handleDeviceInformation();
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

function handleDeviceInformation() {
    const token = window.sessionStorage.getItem('patient-token');
    $.aja***REMOVED***({
        url: '/devices/device-info',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ token }),
        dataType: 'json',
    }).done(function(device) {
        // Handle the server response here
        // alert('Device Information: ' + JSON.stringify(serverResponse));
        displayDeviceInformation(device);
    }).fail(function(err) {
        console.error('Error fetching device information:', err);
        // Handle the error appropriately
        alert('Error ' + err.status + ' fetching device information: ' + JSON.stringify(err));
    });
}

function displayDeviceInformation(device) {
    const deviceName = device.product_id === 32 ? "Boron" : "Argon";
    
    updateDeviceImage(deviceName);
    $('.deviceName').te***REMOVED***t(deviceName);
    $('#deviceId').te***REMOVED***t(device.id);
    $('#serialNumber').te***REMOVED***t(device.serial_number);
    $('#firmwareVersion').te***REMOVED***t(device.system_firmware_version);
}

function updateDeviceImage(deviceName) {
    const imageUrl = `assets/img/${deviceName}_Board.jpg`;
    $('#deviceImageDiv').html(`<img src="${imageUrl}" alt="device-image" class="device-picture">`);
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