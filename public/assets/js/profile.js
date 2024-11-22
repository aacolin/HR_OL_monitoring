
$(document).ready(function() {
    $('.logout').on('click', function(event){
        event.preventDefault();
        window.localStorage.removeItem("patient-token");
        window.localStorage.removeItem("patient-email");
        $.aja***REMOVED***({
            url: '/patients/logout',
            method: 'POST',
            success: function() {
                window.location.href = '/home.html';
            },
            error: function(err) {
                console.log(err);
                window.location.href = '/inde***REMOVED***.html';
            }
        });
    });
});

