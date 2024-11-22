
$(document).ready(function() {
    $('#signUpForm').on('submit', function(event) {
        event.preventDefault();
        $('.errorDiv').hide(); 
        var errorMessages = [];
        const fields = [
            { id: '#firstName', message: 'Invalid or missing First Name.' },
            { id: '#lastName', message: 'Invalid or missing Last Name.' },
            { id: '#password', message: 'Invalid or missing Password.' },
            { id: '#confirmPassword', message: 'Password can not be empty.' }
        ];
        fields.forEach(field => {
            if ($(field.id).val() === "") {
                errorMessages.push(field.message);
            }
        });
        var emailRege***REMOVED*** = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
        if (!emailRege***REMOVED***.test($('#email').val())) {
            errorMessages.push("Invalid or missing email address.");
        }
       
        var currentPassword = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();
        
        if(currentPassword.length > 0) {
            if (currentPassword.length < 10 || currentPassword.length > 20) {
                errorMessages.push("Password must be between 10 and 20 characters.");
            }
            if (!/[a-z]/.test(currentPassword)) {
                errorMessages.push("Password must contain at least one lowercase character.");
            }
            if (!/[A-Z]/.test(currentPassword)) {
                errorMessages.push("Password must contain at least one uppercase character.");
            }
            if (!/[0-9]/.test(currentPassword)) {
                errorMessages.push("Password must contain at least one digit.");
            }
            if ((confirmPassword.length > 0) && (currentPassword !== confirmPassword)) {
                errorMessages.push("Passwords do not match.");
            }
        }
        if (errorMessages.length > 0) {
            displayErrorMessages(errorMessages);
            return;
        }
        const patientInfo = {
            FirstName: $('#firstName').val(),
            LastName: $('#lastName').val(),
            Email: $('#email').val(),
            Password: $('#password').val(),
        };
        const patientInfoInJSON = JSON.stringify(patientInfo);
        $.aja***REMOVED***({
            url: '/patients/signup',
            method: 'POST',
            contentType: 'application/json',
            data: patientInfoInJSON,
            dataType: 'json'
        })
        .done(function(data) {
            window.localStorage.setItem('signup-success', 'true');
            window.location.href = '/login.html';
        })
        .fail(function(err) {
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