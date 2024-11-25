$(document).ready(function() {
    const localStorageToken = window.localStorage.getItem('patient-token');
    let sessionToken = window.sessionStorage.getItem('patient-token');

    handleTokenRedirection(localStorageToken, sessionToken);

    $('#logInForm').on('submit', function(event) {
        event.preventDefault();
        handleFormSubmission();
    });

    displaySignUpSuccessMessage();
});

function handleTokenRedirection(localStorageToken, sessionToken) {
    if (sessionToken) {
        window.location.href = '/user-profile.html';
    } else if (localStorageToken) {
        window.sessionStorage.setItem('patient-token', localStorageToken);
        window.location.href = '/user-profile.html';
    }
}

function handleFormSubmission() {
    var errorMessages = [];
    const loginFormFields = getLoginFormFields();
    const credentialsInJSON = JSON.stringify(loginFormFields);

    $.aja***REMOVED***({
        url: '/patients/login',
        method: 'POST',
        contentType: 'application/json',
        data: credentialsInJSON,
        dataType: 'json'
    })
    .done(function(data) {
        storeTokenAndRedirect(data.patientToken);
    })
    .fail(function(err){
        errorMessages.push(err.responseJSON.message);
        displayErrorMessages(errorMessages);
    });
}

function getLoginFormFields() {
    return {
        Email: $('#email').val(),
        Password: $('#password').val(),
    };
}

function storeTokenAndRedirect(token) {
    const storage = $('#rememberMe').is(':checked') ? window.localStorage : window.sessionStorage;
    storage.setItem('patient-token', token);
    window.location.href = '/heart-summary.html';
}

function displaySignUpSuccessMessage() {
    if (window.localStorage.getItem('signup-success') === 'true') {
        $('.successfulSignUp').show();
        window.localStorage.removeItem('signup-success');
    }
}

function displayErrorMessages(messages) {
    var errorMessageHtml = "<ul>";
    messages.forEach(function(message) {
        errorMessageHtml += "<li class='errorMessage'>" + message + "</li>";
    });
    errorMessageHtml += "</ul>";
    $('.errorDiv').html(errorMessageHtml);
    $('.errorDiv').show();
}