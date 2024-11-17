
$(document).ready(function() {
    $('#signUpForm').on('submit', function(event) {
        event.preventDefault();
        $('.errorDiv').hide(); 
        var errorMessages = [];
        const fields = [
            { id: '#firstName', message: 'Invalid or missing First Name.' },
            { id: '#lastName', message: 'Invalid or missing Last Name.' },
            { id: '#password', message: 'Invalid or missing Password.' },
            { id: '#confirmPassword', message: 'Invalid or missing Confirm Password.' }
        ];
        fields.forEach(field => {
            if ($(field.id).val() === "") {
                errorMessages.push(field.message);
            }
        });
        if($('#password').val() !== $('#confirmPassword').val()) {
            errorMessages.push("Passwords do not match.");
        }
        var emailRege***REMOVED*** = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
        if (!emailRege***REMOVED***.test($('#email').val())) {
            errorMessages.push("Invalid or missing email address.");
        }
        if (errorMessages.length > 0) {
            displayErrorMessages(errorMessages);
            return;
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
                errorMessages.push("Password and Confirm Password don't match.");
            }
        }
        let patientInfo = {
            FirstName: $('#firstName').val(),
            LastName: $('#lastName').val(),
            Email: $('#email').val(),
            Password: $('#password').val(),
        };
        $.aja***REMOVED***({
            url: '/patients/signup',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(patientInfo),
            dataType: 'json'
        })
        .done(function(data) {
            window.localStorage.setItem('patient-token', data.patientToken);
            window.localStorage.setItem('signup-success', 'true');
            window.location.href = '/login.html';
        })
        .fail(function(err) {
            if(err.status === 409) {
                displayErrorMessages([err.responseJSON.message]);
            }
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