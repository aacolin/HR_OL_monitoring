
document.addEventListener('DOMContentLoaded', function() {
    if (window.localStorage.getItem('signup-success') === 'true') {
        document.querySelector('.successfulSignUp').style.display = 'block';
        window.localStorage.removeItem('signup-success');
    }
});



$(document).ready(function() {
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
            dataType: 'json',
        }).done(function(data) {
            if ($('#rememberMe').checked) {
                window.localStorage.setItem('patient-token', data.patientToken);
            }
            window.location.href = '/home.html';
        }).fail(function(err){
            errorMessages.push(err.responseJSON.message);
            displayErrorMessages(errorMessages);
        });
    });
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