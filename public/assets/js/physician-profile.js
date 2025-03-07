$(document).ready(function() {
    handleTokenValidation();
    setupLogoutHandler();
    setupSaveProfileChangesHandler();
    setupCancelProfileChangesHandler();
    setupChangePasswordHandler();
    setupCancelPasswordChangesHandler();
    setupTabSwitchHandler(); // Renamed this line
});

function handleTokenValidation() {
    const localStorageToken = window.localStorage.getItem('physician-token');
    const sessionToken = window.sessionStorage.getItem('physician-token');

    if (localStorageToken && !sessionToken) {
        window.sessionStorage.setItem('physician-token', localStorageToken);
        sessionToken = localStorageToken;
    }

    if (!sessionToken && !localStorageToken) {
        redirectToHomePage();
    } else {
        validateTokenWithServer(sessionToken);
    }
}



function validateTokenWithServer(token) {
    $.ajax({
        url: '/physicians/token-auth',
        method: 'GET',
        contentType: 'application/json',
        headers: {'x-auth': token},
        dataType: 'json',
    }).done(function(data) {
        document.body.classList.remove('hidden');
        getPhysicianProfile(token); 
    }).fail(function(err) {
        handleTokenValidationError();
    });
}

function handleTokenValidationError() {
    window.localStorage.removeItem('physician-token');
    redirectToHomePage();
}

function redirectToHomePage() {
    window.location.href = '/home.html';
}

function setupLogoutHandler() {
    $('.logout').on('click', function(event){
        event.preventDefault();
        window.sessionStorage.removeItem("physician-token");
        window.localStorage.removeItem("physician-token");
        document.body.classList.add('hidden');
        redirectToHomePage();
    });
}

function getPhysicianProfile(token) {
    $.ajax({
        url: '/physicians/profile',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ token: token }),
        dataType: 'json',
    })
    .done(function(data) {
        displayPhysicianProfile(data.profile);
    })
    .fail(function(err) {
        console.log('Error:', err);
    });
}

function displayPhysicianProfile(profile) {
    const physicianName = profile.firstName + ' ' + profile.lastName;
    const physicianEmail = profile.email;
    const specialty = profile.specialty;
    $('#physicianFullName').text(physicianName);
    $('#physicianSpecialty').text(specialty);
    $('#physicianEmail').text(physicianEmail);
    $('.physicianFirstName').text(physicianName);

}

function setupSaveProfileChangesHandler() {
    $('#saveProfileChanges').on('click', function(event) {
        event.preventDefault();
        const firstName = $('#editFirstName').val();
        const lastName = $('#editLastName').val();
        const errorMessages = [];

        if (!firstName) {
            errorMessages.push('First Name cannot be empty.');
        }
        if (!lastName) {
            errorMessages.push('Last Name cannot be empty.');
        }

        if (errorMessages.length > 0) {
            displayErrorMessages(errorMessages);
            return;
        }

        // Proceed with saving profile changes
        saveProfileChanges(firstName, lastName);
    });
}

function saveProfileChanges(firstName, lastName) {
    const token = window.sessionStorage.getItem('physician-token');
    $.ajax({
        url: '/physicians/profile', // Corrected URL
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ token: token, firstName: firstName, lastName: lastName }),
        dataType: 'json',
    })
    .done(handleProfileUpdateSuccess)
    .fail(function(err) {
        displayErrorMessages([err.responseJSON.message]);
    });
}

function handleProfileUpdateSuccess(data) {
    alert('Profile updated successfully.');
    clearProfileEditForm();
    hideErrorMessages();
    getPhysicianProfile(window.sessionStorage.getItem('physician-token'));
    redirectToProfileOverview();
}

function clearProfileEditForm() {
    $('#editFirstName').val('');
    $('#editLastName').val('');
}

function hideErrorMessages() {
    $('.errorDiv').hide();
}

function redirectToProfileOverview() {
    window.location.href = '/physician-profile.html';
}

function displayErrorMessages(messages) {
    const errorMessageHtml = messages.map(message => `<li class='errorMessage'>${message}</li>`).join('');
    $('.errorDiv').html(`<ul>${errorMessageHtml}</ul>`).show();
}

function setupCancelProfileChangesHandler() {
    $('#cancelProfileChanges').on('click', function(event) {
        event.preventDefault();
        $('#editFirstName').val('');
        $('#editLastName').val('');
        $('.errorDiv').hide();
    });
}

function setupCancelPasswordChangesHandler() {
    $('#cancelPasswordChanges').on('click', function(event) {
        event.preventDefault();
        clearChangePasswordForm();
        hideErrorMessages();
    });
}

function setupChangePasswordHandler() {
    $('#changePasswordForm').on('submit', function(event) {
        event.preventDefault();
        const currentPassword = $('#currentPassword').val();
        const newPassword = $('#newPassword').val();
        const reEnterNewPassword = $('#reEnternewPassword').val();
        const errorMessages = [];

        if (!currentPassword) {
            errorMessages.push('Current Password cannot be empty.');
        }
        if (!newPassword) {
            errorMessages.push('New Password cannot be empty.');
        }
        if (newPassword !== reEnterNewPassword) {
            errorMessages.push('New Password and Re-enter New Password do not match.');
        }
        if (newPassword.length < 10 || newPassword.length > 20) {
            errorMessages.push('Password must be between 10 and 20 characters.');
        }
        if (!/[a-z]/.test(newPassword)) {
            errorMessages.push('Password must contain at least one lowercase character.');
        }
        if (!/[A-Z]/.test(newPassword)) {
            errorMessages.push('Password must contain at least one uppercase character.');
        }
        if (!/[0-9]/.test(newPassword)) {
            errorMessages.push('Password must contain at least one digit.');
        }

        if (errorMessages.length > 0) {
            displayErrorMessages(errorMessages);
            return;
        }

        // Proceed with changing the password
        changePassword(currentPassword, newPassword);
    });
}

function changePassword(currentPassword, newPassword) {
    const token = window.sessionStorage.getItem('physician-token');
    $.ajax({
        url: '/physicians/change-password',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ token: token, currentPassword: currentPassword, newPassword: newPassword }),
        dataType: 'json',
    })
    .done(function(data) {
        alert('Password changed successfully.');
        clearChangePasswordForm();
        hideErrorMessages();
        redirectToProfileOverview();
    })
    .fail(function(err) {
        displayErrorMessages([err.responseJSON.message]);
    });
}

function clearChangePasswordForm() {
    $('#currentPassword').val('');
    $('#newPassword').val('');
    $('#reEnternewPassword').val('');
}

function setupTabSwitchHandler() {
    // clear form fields and error messages when switching tabs
    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function(event) {
        const target = $(event.target).attr("data-bs-target");

        if (target === "#profile-edit") {
            clearProfileEditForm();
            hideErrorMessages();
        } else if (target === "#profile-change-password") {
            clearChangePasswordForm();
            hideErrorMessages();
        } else if (target === "#profile-settings") {
            // Add functionality to clear fields if needed in the future
            // For now, just a comment to indicate it will be implemented soon
        }
    });
}