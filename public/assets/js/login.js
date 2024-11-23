$(document).ready(function() {
    const localStorageToken = window.localStorage.getItem('patient-token');
    let sessionToken = window.sessionStorage.getItem('patient-token');

    if (sessionToken) {
        // Session token e***REMOVED***ists, redirect to user profile
        window.location.href = '/user-profile.html';
    } else if (localStorageToken) {
        // Local storage token e***REMOVED***ists, set session token and redirect to user profile
        window.sessionStorage.setItem('patient-token', localStorageToken);
        window.location.href = '/user-profile.html';
    }

    // Handle the form submission
    $('#logInForm').on('submit', function(event) {
        event.preventDefault();
        var errorMessages = [];

        const loginFormFields = {
            Email: $('#email').val(),
            Password: $('#password').val(),
        };
    
        const credentials = {
            Email: loginFormFields.Email,
            Password: loginFormFields.Password
        }
        const credentialsInJSON = JSON.stringify(credentials);
        
        $.aja***REMOVED***({
            url: '/patients/login',
            method: 'POST',
            contentType: 'application/json',
            data: credentialsInJSON,
            dataType: 'json'
        })
        .done(function(data) {
                const storage = $('#rememberMe').is(':checked') ? window.localStorage : window.sessionStorage;
                storage.setItem('patient-token', data.patientToken);
                window.location.href = '/user-profile.html';
        })
        .fail(function(err){
            errorMessages.push(err.responseJSON.message);
            displayErrorMessages(errorMessages);
        });
    });
    // Display the successful sign up message
    if (window.localStorage.getItem('signup-success') === 'true') {
        $('.successfulSignUp').show();
        window.localStorage.removeItem('signup-success');
    }
});

function displayErrorMessages(messages) {
    var errorMessageHtml = "<ul>";
    messages.forEach(function(message) {
        errorMessageHtml += "<li class='errorMessage'>" + message + "</li>";
    });
    errorMessageHtml += "</ul>";
    $('.errorDiv').html(errorMessageHtml);
    $('.errorDiv').show();
}