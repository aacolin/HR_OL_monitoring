
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
            email: $('#email').val(),
            password: $('#password').val(),
        };
    
        const credentials = {
            email: loginFormFields.email,
            password: loginFormFields.password
        }
        const credentialsInJSON = JSON.stringify(credentials);

        
        $.aja***REMOVED***({
            url: '/patients/login',
            method: 'POST',
            contentType: 'application/json',
            data: credentialsInJSON,
            dataType: 'json',
        }).done(function(data) {
            if (this.status === 200){
                alert("Login success");
            }
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