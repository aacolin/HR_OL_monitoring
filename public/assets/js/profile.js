$(document).ready(function() {
    handleTokenValidation();
    setupLogoutHandler();
    setupSaveProfileChangesHandler();
    setupCancelProfileChangesHandler();
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

function getPatientProfile(token) {
    $.aja***REMOVED***({
        url: '/patients/profile',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ token: token }),
        dataType: 'json',
    })
    .done(function(data) {
        displayPatientProfile(data.profile);
    })
    .fail(function(err) {
        console.log('Error:', err);
    });
}

function displayPatientProfile(profile) {
    const patientName = profile.firstName + ' ' + profile.lastName;
    const patientEmail = profile.email;
    $('#fullName').te***REMOVED***t(patientName);
    $('#patientEmail').te***REMOVED***t(patientEmail);
}

function setupSaveProfileChangesHandler() {
    $('#saveProfileChanges').on('click', function(event) {
        event.preventDefault();
        const firstName = $('#editFirstName').val();
        const lastName = $('#editLastName').val();
        const errorMessages = [];

        if (!firstName) {
            errorMessages.push('First Name cannot be empty.');
        }
        if (!lastName) {
            errorMessages.push('Last Name cannot be empty.');
        }

        if (errorMessages.length > 0) {
            displayErrorMessages(errorMessages);
            return;
        }

        // Proceed with saving profile changes
        saveProfileChanges(firstName, lastName);
    });
}

function saveProfileChanges(firstName, lastName) {
    const token = window.sessionStorage.getItem('patient-token');
    $.aja***REMOVED***({
        url: '/patients/profile',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ token: token, firstName: firstName, lastName: lastName }),
        dataType: 'json',
    })
    .done(handleProfileUpdateSuccess)
    .fail(function(err) {
        displayErrorMessages([err.responseJSON.message]);
    });
}

function handleProfileUpdateSuccess(data) {
    alert('Profile updated successfully.');
    clearProfileEditForm();
    hideErrorMessages();
    getPatientProfile(window.sessionStorage.getItem('patient-token'));
    redirectToProfileOverview();
}

function clearProfileEditForm() {
    $('#editFirstName').val('');
    $('#editLastName').val('');
}

function hideErrorMessages() {
    $('.errorDiv').hide();
}

function redirectToProfileOverview() {
    window.location.href = '/user-profile.html';
}

function displayErrorMessages(messages) {
    const errorMessageHtml = messages.map(message => `<li class='errorMessage'>${message}</li>`).join('');
    $('.errorDiv').html(`<ul>${errorMessageHtml}</ul>`).show();
}

function setupCancelProfileChangesHandler() {
    $('#cancelProfileChanges').on('click', function(event) {
        event.preventDefault();
        $('#editFirstName').val('');
        $('#editLastName').val('');
        $('.errorDiv').hide();
    });
}