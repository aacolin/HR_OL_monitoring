$(document).ready(function() {
    handleTokenValidation();
    handleDeviceInformation();
    handleAddDeviceButton();
    handleCancelButton();
    setupDeviceList();
    handleRemoveDeviceButton();
    handleChangeDeviceButton();
    setupLogoutHandler();
    setupTabSwitchHandlers();
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
        if (!device) {
            hideDeviceInformation();
        }
        displayDeviceInformation(device);
    }).fail(function(err) {
        if (err.status === 403) {
            hideDeviceInformation();
            return;
        }
        console.error('Error fetching device information:', err);
        // Handle the error appropriately
        // alert('Error ' + err.status + ' fetching device information: ' + JSON.stringify(err));
    });
}

function hideDeviceInformation() {
    // const deviceName = device.product_id === 32 ? "Photon" : "Argon";
    
    // updateDeviceImage(deviceName);
    $('.deviceName').te***REMOVED***t('Please add a device');
    $('#deviceId').te***REMOVED***t('');
    $('#serialNumber').te***REMOVED***t('');
    $('#firmwareVersion').te***REMOVED***t('');
}
function displayDeviceInformation(device) {
    const deviceName = device.product_id === 32 ? "Photon" : "Argon";
    
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
function handleAddDeviceButton() {
    $('#addDeviceButton').on('click', function(event) {
        event.preventDefault();
        const token = window.sessionStorage.getItem('patient-token');
        const deviceId = $('#newDeviceId').val();
        if (checkForEmptyDeviceID(deviceId)) {
            addDevice(token, deviceId);
        }
    });
}

function addDevice(token, deviceId) {
    $.aja***REMOVED***({
        url: '/devices/add-device',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ token, deviceId })
    }).done(function(response) {
        // Handle success response
        console.log('Device added successfully:', response);
        alert('Device: '+ deviceId + ' added successfully');
        clearForm();
        window.location.reload();
        // Optionally, update the UI to reflect the new device
    }).fail(function(serverResponse) {
        const errorMessage = serverResponse.responseJSON ? serverResponse.responseJSON.message : 'An error occurred';
        $('.errorDiv').te***REMOVED***t(errorMessage).show();
        if (serverResponse.status === 403) {
            $('#newDeviceId').focus();
        }
    });
}

function checkForEmptyDeviceID(deviceId) {
    if (!deviceId || deviceId === '' || deviceId === null) {
        $('.errorDiv').te***REMOVED***t('Device ID is required').show();
        $('#newDeviceId').focus();
        return false;
    }
    $('.errorDiv').hide();
    return true;
}

function handleCancelButton() {
    $('#cancelButton').on('click', function(event) {
        event.preventDefault();
        clearForm();
        $('#newDeviceId').focus();
    });
}

function clearForm() {
    $('#newDeviceId').val('');
    $('#newDeviceName').val('');
    $('.errorDiv').hide();
}

function setupTabSwitchHandlers() {
    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function(event) {
        const target = $(event.target).attr("data-bs-target");

        if (target === "#profile-justified") {
            clearForm();
            $('.errorDiv').hide();
            
        } else if (target === "#home-justified") {
        }
    });
}

function setupDeviceList() {
    const token = window.sessionStorage.getItem('patient-token');
    $.aja***REMOVED***({
        url: '/patients/profile',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ token }),
        dataType: 'json',
    }).done(function(serverResponse) {
        //const devices = serverResponse.patientProfile.devices;
        // alert('Devices: ' + JSON.stringify(devices));
        displayDeviceList( serverResponse);
    }).fail(function(err) {
        console.error('Error fetching device list:', err);
        // Handle the error appropriately
        alert('Error ' + err.status + ' fetching device list: ' + JSON.stringify(err));
    });
}

function displayDeviceList(serverResponse) {
  const deviceSelector = $('.deviceIdSelector');
  deviceSelector.empty();
  deviceSelector.append('<option value="default">Select Device</option>');
  
  const deviceList = serverResponse.patientProfile.devices;
  for (let i = 0; i < deviceList.length; i++) {
    const deviceOption = `<option value="${i}">${deviceList[i]}</option>`;
    deviceSelector.append(deviceOption);
  }
}

function handleChangeDeviceButton() {
    $('#changeDeviceButton').on('click', function(event) {
        event.preventDefault();
        const deviceInde***REMOVED*** = $('#changeDeviceSelector').val();
        // alert('Device Inde***REMOVED***: ' + deviceInde***REMOVED***);
        if (deviceInde***REMOVED*** === 'default') {
            $('.errorDiv').te***REMOVED***t('Please select a device').show();
            return;
        }
        const token = window.sessionStorage.getItem('patient-token');
        const deviceId = $('#changeDeviceSelector option:selected').te***REMOVED***t();
        changeDevice(token, deviceId);
    });
}

function changeDevice(token, deviceId) {
    $.aja***REMOVED***({
        url: '/patients/change-device',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ token, deviceId }),
        dataType: 'json',
    }).done(function(device) {
        // alert('Device changed successfully');
        window.location.reload();
    }).fail(function(err) {
        console.error('Error fetching device information:', err);
        // Handle the error appropriately
        alert('Error ' + err.status + ' fetching device information: ' + JSON.stringify(err));
    });
}


function handleRemoveDeviceButton() {

   

    $('#removeDeviceButton').on('click', function(event) {
        event.preventDefault();
        if ($('#removeDeviceSelector').val() === 'default') {
            // $('#removeDeviceButton').prop('disabled', true);
            $('.errorDiv').te***REMOVED***t('Please select a device').show();
            return;
        }
        const token = window.sessionStorage.getItem('patient-token');
        const deviceId = $('#deviceId').te***REMOVED***t();
        removeDevice(token, deviceId);
    });
}

function removeDevice(token, deviceId) {
    $.aja***REMOVED***({
        url: '/patients/remove-device',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ token, deviceId }),
        dataType: 'json',
    }).done(function(response) {
        // Handle success response
        console.log('Device removed successfully:', response);
        alert('Device removed successfully');
        window.location.reload();
        // Optionally, update the UI to reflect the new device
    }).fail(function(serverResponse) {
        const errorMessage = serverResponse.responseJSON ? serverResponse.responseJSON.message : 'An error occurred';
        $('.errorDiv').te***REMOVED***t(errorMessage).show();
        if (serverResponse.status === 403) {
            $('#newDeviceId').focus();
        }
    });
}