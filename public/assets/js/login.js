
document.addEventListener('DOMContentLoaded', function() {
    if (window.localStorage.getItem('signup-success') === 'true') {
        document.querySelector('.successfulSignUp').style.display = 'block';
        window.localStorage.removeItem('signup-success');
    }
});

var loginFormFields = {
    email: $('#email'),
    password: $('#password'),
    isMissing(fieldOfInterest){
        return fieldOfInterest.val() === '';
    }
};

$(document).ready(function() {
    $('#logInForm').on('submit', function(event) {
            event.preventDefault();
            if (loginFormFields.isMissing(loginFormFields.email) || loginFormFields.isMissing(loginFormFields.password)){

                return;
            }
            let credentials = {
                email: loginFormFields.email,
                password: loginFormFields.password
            }

            let credentialsInJSON = JSON.stringify(credentials);
            $.aja***REMOVED***({
                url: '/patients/login',
                method: 'POST',
                contentType: 'application/json',
                data: credentialsInJSON,
                dataType: 'json',
            }).done(function(data){
                    if (data.success) {
                        alert('Login successful');
                    }
            }).fail(function(err){
                    alert('Login failed');
            });
        });
});