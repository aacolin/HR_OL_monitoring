
$(document).ready(function() {

     // Check if the token e***REMOVED***ists in local storage
     const token = window.localStorage.getItem('patient-token');
     if (token) {
         $.aja***REMOVED***({
            url: '/patients/token-auth',
            method: 'GET',
            contentType: 'application/json',
            headers: {'***REMOVED***-auth': token},
            dataType: 'json',
         }).done(function(data) {
             if (data.status === 200) {
                 window.location.href = 'user-profile.html';
             }
         }).fail(function(err) {
            alert('error: ' + err.status + ' ' + err.responseJSON.message);
         });
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
            if ($('#rememberMe').is(':checked')) {
                window.localStorage.setItem('patient-token', data.patientToken);
            }
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