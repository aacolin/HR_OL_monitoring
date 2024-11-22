
document.addEventListener('DOMContentLoaded', function() {

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
});

$(document).ready(function() {
    $('.logout').on('click', function(event){
        event.preventDefault();
        window.localStorage.removeItem("patient-token");
        document.body.classList.add('hidden');
        window.location.href = '/home.html';
    });
});