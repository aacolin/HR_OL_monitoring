$(document).ready(function() {
    const localStorageToken = window.localStorage.getItem('patient-token');
    let sessionToken = window.sessionStorage.getItem('patient-token');

    if (localStorageToken && !sessionToken) {
        window.sessionStorage.setItem('patient-token', localStorageToken);
        sessionToken = localStorageToken;
    }

    if (!sessionToken && !localStorageToken) {
        // Token does not e***REMOVED***ist, redirect to home page
        window.location.href = '/home.html';
    }
    else {
        // Token e***REMOVED***ists, validate it with the server
        $.aja***REMOVED***({
            url: '/patients/token-auth',
            method: 'GET',
            contentType: 'application/json',
            headers: {'***REMOVED***-auth': sessionToken},
            dataType: 'json',
        }).done(function(data) {
            // Token is valid, show the content
            document.body.classList.remove('hidden');
            getPatientProfile(sessionToken);
        }).fail(function(err) {
            // Error occurred during token validation, redirect to home page
            window.localStorage.removeItem('patient-token');
            window.location.href = '/home.html';
        });
    }     
    
    $('.logout').on('click', function(event){
        event.preventDefault();
        window.sessionStorage.removeItem("patient-token");
        window.localStorage.removeItem("patient-token");
        document.body.classList.add('hidden');
        window.location.href = '/home.html';
    });

    
});

function getPatientProfile(token) {
    $.aja***REMOVED***({
        url: '/patients/profile',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ token: token }), // Ensure the token is sent correctly
        dataType: 'json',
    })
    .done(function(data) {
        const patientName = data.profile.firstName + ' ' + data.profile.lastName;
        const patientEmail = data.profile.email;
        $('#fullName').te***REMOVED***t(patientName);
        $('#patientEmail').te***REMOVED***t(patientEmail);
    })
    .fail(function(err) {
        console.log('Error:', err);
    });
}