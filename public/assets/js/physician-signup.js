$(document).ready(function() {
    $('#signUpForm').on('submit', function(event) {
        event.preventDefault();
        handleFormSubmission();
    });

    function handleFormSubmission() {
        $('.errorDiv').hide(); 
        const signUpFormData = getFormData();
        const errorMessages = validateFormData(signUpFormData);

        if (errorMessages.length > 0) {
            displayErrorMessages(errorMessages);
            return;
        }

        submitForm(signUpFormData);
    }

    function getFormData() {
        return {
            FirstName: $('#firstName').val(),
            LastName: $('#lastName').val(),
            Specialty: $('#specialty').val(),
            Email: $('#email').val(),
            Password: $('#password').val(),
            ConfirmPassword: $('#confirmPassword').val()
        };
    }

    function validateFormData(formData) {
        const errorMessages = [];
        checkRequiredFields(formData, errorMessages);
        validateSpecialty(formData.Specialty, errorMessages);
        validateEmail(formData.Email, errorMessages);
        validatePasswords(formData.Password, formData.ConfirmPassword, errorMessages);
        return errorMessages;
    }

    function checkRequiredFields(formData, errorMessages) {
        const requiredFields = ['FirstName', 'LastName', 'Specialty', 'Email', 'Password', 'ConfirmPassword'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                errorMessages.push(`Missing ${field.replace(/([A-Z])/g, ' $1').trim()}`);
            }
        }
    }

    function validateEmail(email, errorMessages) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
        if (!emailRegex.test(email)) {
            errorMessages.push("Invalid or missing email address.");
        }
    }

    function validatePasswords(password, confirmPassword, errorMessages) {
        if (password.length > 0) {
            if (password.length < 10 || password.length > 20) {
                errorMessages.push("Password must be between 10 and 20 characters.");
            }
            if (!/[a-z]/.test(password)) {
                errorMessages.push("Password must contain at least one lowercase character.");
            }
            if (!/[A-Z]/.test(password)) {
                errorMessages.push("Password must contain at least one uppercase character.");
            }
            if (!/[0-9]/.test(password)) {
                errorMessages.push("Password must contain at least one digit.");
            }
            if (confirmPassword.length > 0 && password !== confirmPassword) {
                errorMessages.push("Passwords do not match.");
            }
        }
    }

    function validateSpecialty(specialty, errorMessages) {
        if (!specialty) {
            errorMessages.push("Specialty must be selected.");
        }
    }

    function submitForm(formData) {
        const patientInfo = {
            FirstName: formData.FirstName,
            LastName: formData.LastName,
            Specialty: formData.Specialty,
            Email: formData.Email,
            Password: formData.Password,
        };
        const patientInfoInJSON = JSON.stringify(patientInfo);

        $.ajax({
            url: '/physicians/signup',
            method: 'POST',
            contentType: 'application/json',
            data: patientInfoInJSON,
            dataType: 'json'
        })
        .done(handleFormSuccess)
        .fail(handleFormError);
    }


    function handleFormSuccess(data) {
        window.localStorage.setItem('physician-signup-success', 'true');
        window.location.href = '/physician-login.html';
    }

    function handleFormError(err) {
        displayErrorMessages([err.responseJSON.message]);
    }

    function displayErrorMessages(messages) {
        const errorMessageHtml = messages.map(message => `<li class='errorMessage'>${message}</li>`).join('');
        $('.errorDiv').html(`<ul>${errorMessageHtml}</ul>`).show();
    }
});