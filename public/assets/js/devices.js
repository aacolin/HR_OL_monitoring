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
    $.ajax({
        url: '/patients/token-auth',
        method: 'GET',
        contentType: 'application/json',
        headers: {'x-auth': token},
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
    $.ajax({
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
    $('.deviceName').text('Please add a device');
    $('#deviceId').text('');
    $('#serialNumber').text('');
    $('#firmwareVersion').text('');
}
function displayDeviceInformation(device) {
    const deviceName = device.product_id === 32 ? "Photon" : "Argon";
    
    updateDeviceImage(deviceName);
    $('.deviceName').text(deviceName);
    $('#deviceId').text(device.id);
    $('#serialNumber').text(device.serial_number);
    $('#firmwareVersion').text(device.system_firmware_version);
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
    $.ajax({
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
        $('.errorDiv').text(errorMessage).show();
        if (serverResponse.status === 403) {
            $('#newDeviceId').focus();
        }
    });
}

function checkForEmptyDeviceID(deviceId) {
    if (!deviceId || deviceId === '' || deviceId === null) {
        $('.errorDiv').text('Device ID is required').show();
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
    $.ajax({
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
        const deviceIndex = $('#changeDeviceSelector').val();
        // alert('Device Index: ' + deviceIndex);
        if (deviceIndex === 'default') {
            $('.errorDiv').text('Please select a device').show();
            return;
        }
        const token = window.sessionStorage.getItem('patient-token');
        const deviceId = $('#changeDeviceSelector option:selected').text();
        changeDevice(token, deviceId);
    });
}

function changeDevice(token, deviceId) {
    $.ajax({
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
            $('.errorDiv').text('Please select a device').show();
            return;
        }
        const token = window.sessionStorage.getItem('patient-token');
        const deviceId = $('#deviceId').text();
        removeDevice(token, deviceId);
    });
}

function removeDevice(token, deviceId) {
    $.ajax({
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
        $('.errorDiv').text(errorMessage).show();
        if (serverResponse.status === 403) {
            $('#newDeviceId').focus();
        }
    });
}