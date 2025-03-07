$(document).ready(function() {
    const localStorageToken = window.localStorage.getItem('physician-token');
    let sessionToken = window.sessionStorage.getItem('physician-token');
    handleTokenRedirection(localStorageToken, sessionToken);

    $('#logInForm').on('submit', function(event) {
        event.preventDefault();
        handleFormSubmission();
    });

    displaySignUpSuccessMessage();
});

function handleTokenRedirection(localStorageToken, sessionToken) {
    if (sessionToken) {
        window.location.href = '/physician-profile.html';
    } else if (localStorageToken) {
        window.sessionStorage.setItem('physician-token', localStorageToken);
        window.location.href = '/physician-profile.html';
    }
}
function handleFormSubmission() {
    var errorMessages = [];
    const loginFormFields = getLoginFormFields();
    const credentialsInJSON = JSON.stringify(loginFormFields);


    $.ajax({
        url: '/physicians/login',
        method: 'POST',
        contentType: 'application/json',
        data: credentialsInJSON,
        dataType: 'json'
    })
    .done(function(data) {
        storeTokenAndRedirect(data.physicianToken);
    })
    .fail(function(err){
        errorMessages.push(err.responseJSON.message);
        console.log(err);
        displayErrorMessages(errorMessages);
    });
}

function getLoginFormFields() {
    return {
        Email: $('#physicianEmail').val(),
        Password: $('#physicianPassword').val(),
    };
}

function storeTokenAndRedirect(token) {
    const storage = $('#rememberMe').is(':checked') ? window.localStorage : window.sessionStorage;
    storage.setItem('physician-token', token);
    window.location.href = '/physician-profile.html';
}

function displaySignUpSuccessMessage() {
    if (window.localStorage.getItem('physician-signup-success') === 'true') {
        $('.successfulSignUp').show();
        window.localStorage.removeItem('physician-signup-success');
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