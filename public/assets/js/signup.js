$(document).ready(function() {
    $('#signUpForm').on('submit', function(event) {
        event.preventDefault();
        $('.errorDiv').hide(); 
        const signUpFormData = getFormData();
        const errorMessages = validateFormData(signUpFormData);

        if (errorMessages.length > 0) {
            displayErrorMessages(errorMessages);
            return;
        }

        submitForm(signUpFormData);
    });

    function getFormData() {
        return {
            FirstName: $('#firstName').val(),
            LastName: $('#lastName').val(),
            Email: $('#email').val(),
            Password: $('#password').val(),
            ConfirmPassword: $('#confirmPassword').val()
        };
    }

    function validateFormData(formData) {
        const errorMessages = [];
        const requiredFields = ['FirstName', 'LastName', 'Email', 'Password', 'ConfirmPassword'];
        
        for (const field of requiredFields) {
            if (!formData[field]) {
                errorMessages.push(`Missing ${field.replace(/([A-Z])/g, ' $1').trim()}`);
            }
        }

        const emailRege***REMOVED*** = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
        if (!emailRege***REMOVED***.test(formData.Email)) {
            errorMessages.push("Invalid or missing email address.");
        }

        const currentPassword = formData.Password;
        const confirmPassword = formData.ConfirmPassword;

        if (currentPassword.length > 0) {
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
            if (confirmPassword.length > 0 && currentPassword !== confirmPassword) {
                errorMessages.push("Passwords do not match.");
            }
        }

        return errorMessages;
    }

    function submitForm(formData) {
        const patientInfo = {
            FirstName: formData.FirstName,
            LastName: formData.LastName,
            Email: formData.Email,
            Password: formData.Password,
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
            displayErrorMessages([err.responseJSON.message]);
        });
    }

    function displayErrorMessages(messages) {
        const errorMessageHtml = messages.map(message => `<li class='errorMessage'>${message}</li>`).join('');
        $('.errorDiv').html(`<ul>${errorMessageHtml}</ul>`).show();
    }
});