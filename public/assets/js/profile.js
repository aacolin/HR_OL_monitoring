
$(document).ready(function() {

    const token = window.localStorage.getItem('patient-token');
    if (!token) {
        // Redirect to home page if token does not e***REMOVED***ist
        window.location.href = '/home.html';
    } else {
        // Token e***REMOVED***ists, validate it with the server
        $.aja***REMOVED***({
            url: '/patients/token-auth',
            method: 'GET',
            contentType: 'application/json',
            headers: {'***REMOVED***-auth': token},
            dataType: 'json',
        }).done(function(data) {
            if (data.status === 200){
                // Token is valid, show the content
                document.body.classList.remove('hidden');
                // getPatientProfile();
            } else {
                // Token is invalid, redirect to home page
                window.localStorage.removeItem('patient-token');
                window.location.href = '/home.html';
            }
        }).fail(function(err) {
            // Error occurred during token validation, redirect to home page
            window.localStorage.removeItem('patient-token');
            window.location.href = '/home.html';
        });
    }


    $('.logout').on('click', function(event){
        event.preventDefault();
        window.localStorage.removeItem("patient-token");
        document.body.classList.add('hidden');
        window.location.href = '/home.html';
    });

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
        console.log('Error:', err);``
    });
});