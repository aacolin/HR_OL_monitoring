$(document).ready(function() {
    handleTokenValidation();
    setupLogoutHandler();
    setupPhysicianListHandler();
    setupSaveProfileChangesHandler();
    setupCancelProfileChangesHandler();
    setupChangePasswordHandler();
    setupCancelPasswordChangesHandler();
    setupTabSwitchHandlers();
    setupChangePhysicianHandler();
});

function handleTokenValidation() {
    const localStorageToken = window.localStorage.getItem('patient-token');
    let sessionToken = window.sessionStorage.getItem('patient-token');

    if (localStorageToken && !sessionToken) {
        window.sessionStorage.setItem('patient-token', localStorageToken);
        sessionToken = localStorageToken;
    }

    if (!sessionToken && !localStorageToken) {
        redirectToHomePage();
    } else {
        validateTokenWithServer(sessionToken);
    }
}

function redirectToHomePage() {
    window.location.href = '/home.html';
}

function validateTokenWithServer(token) {
    $.aja***REMOVED***({
        url: '/patients/token-auth',
        method: 'GET',
        contentType: 'application/json',
        headers: {'***REMOVED***-auth': token},
        dataType: 'json',
    }).done(function(data) {
        document.body.classList.remove('hidden');
        getPatientProfile(token);
    }).fail(function(err) {
        handleTokenValidationError();
    });
}

function handleTokenValidationError() {
    window.localStorage.removeItem('patient-token');
    redirectToHomePage();
}

function setupLogoutHandler() {
    $('.logout').on('click', function(event){
        event.preventDefault();
        window.sessionStorage.removeItem("patient-token");
        window.localStorage.removeItem("patient-token");
        document.body.classList.add('hidden');
        redirectToHomePage();
    });
}

function getPatientProfile(token) {
    $.aja***REMOVED***({
        url: '/patients/profile',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ token: token }),
        dataType: 'json',
    })
    .done(function(serverResponse) {
        const patient = serverResponse.patientProfile;

        getPhysicianInfo(patient.physicianEmail).then(function(physician) {
            displayPatientProfile(patient, physician);
        }).catch(function(err) {
            console.log('Error:', err);
        });
    })
    .fail(function(err) {
        console.log('Error:', err);
    });
}

function getPhysicianInfo(physicianEmail) {
    return new Promise(function(resolve, reject) {
        const email = physicianEmail;
        $.aja***REMOVED***({
            url: '/physicians/physician-info',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ token: email }),
            dataType: 'json',
        })
        .done(function(serverResponse) {
            resolve(serverResponse.physicianProfile);
        })
        .fail(function(err) {
            reject(err);
        });
    });
}

function displayPatientProfile(patient, physician) {
    const patientFullName = `${patient.firstName} ${patient.lastName}`;
    const patientEmail = patient.email;

    $('#patientEmail').te***REMOVED***t(patientEmail);
    $('.patientFullName').te***REMOVED***t(patientFullName);

    if (!physician.email) {
        $('#physicianName').te***REMOVED***t('No Physician Assigned. Please select a physician.');
    } else {
        $('#physicianName').te***REMOVED***t(`Dr. ${physician.firstName} ${physician.lastName}`);
    }
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
    const token = window.sessionStorage.getItem('patient-token');
    $.aja***REMOVED***({
        url: '/patients/profile',
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
    getPatientProfile(window.sessionStorage.getItem('patient-token'));
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
    window.location.href = '/user-profile.html';
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
    const token = window.sessionStorage.getItem('patient-token');
    $.aja***REMOVED***({
        url: '/patients/change-password',
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

function setupTabSwitchHandlers() {
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

function setupPhysicianListHandler() {
    const email = window.sessionStorage.getItem('patient-token');
 
    $.aja***REMOVED***({
        url: '/physicians/physicians-list',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ token: email}),
        dataType: 'json',
    })
    .done(function(serverResponse) {
        $('#physicianList').find('option:not(:first)').remove();
        const physicians = serverResponse.physiciansList;
        const physicianOptions = physicians.map(physician => {
            const email = physician.email;
            const fullName = `Dr. ${physician.firstName} ${physician.lastName}`;
            return `<option value="${email}">${fullName}</option>`;
        });
        $('#physicianList').append(physicianOptions);
    })
    .fail(function(err) {
        console.log('Error:', err);
    });
}

function setupChangePhysicianHandler() {
    $('#changePhysicianForm').on('submit', function(event) {
        event.preventDefault();
        const physicianEmail = $('#physicianList').val();
        // alert(physicianEmail);   
        const patientEmail = $('#patientEmail').te***REMOVED***t();
        // alert(patientEmail); 
        changePhysician(physicianEmail, patientEmail);
    });
}

function changePhysician(physicianEmail, patientEmail) {
    $.aja***REMOVED***({
        url: '/patients/change-physician',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ physicianEmail: physicianEmail, patientEmail: patientEmail }),
        dataType: 'json',
    })
    .done(function(serverResponse) {
        // alert('Physician changed successfully.');
        const patien = serverResponse.patientProfile;
        const physician = serverResponse.physicianProfile;
        displayPatientProfile(patien, physician);
        document.location.reload();
    })
    .fail(function(err) {
        console.log('Error:', err);
        alert('Failed to change physician.');
    });
}

