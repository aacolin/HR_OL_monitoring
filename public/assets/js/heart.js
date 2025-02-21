

$(document).ready(function() {
    const localStorageToken = window.localStorage.getItem('patient-token');
    const sessionToken = window.sessionStorage.getItem('patient-token');

    handleTokenValidation(localStorageToken, sessionToken);

    getPatientProfile(sessionToken);
    setupLogoutHandler();
});










function handleTokenValidation(localStorageToken, sessionToken) {
    
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
    $.ajax({
        url: '/patients/profile',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ token: token }),
        dataType: 'json',
    })
    .done(function(serverResponse) {
        displayPatientProfile(serverResponse);
    })
    .fail(function(err) {
        console.log('Error:', err);
    });
}

function displayPatientProfile(serverResponse) {
    const patient = serverResponse.patientProfile;
    // alert("Patient: " + patient);

    const patientFullName = `${patient.firstName} ${patient.lastName}`;

    $('.patientFullName').text(patientFullName);

}



