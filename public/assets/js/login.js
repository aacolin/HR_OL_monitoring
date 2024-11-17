
document.addEventListener('DOMContentLoaded', function() {
    if (window.localStorage.getItem('signup-success') === 'true') {
        document.querySelector('.successfulSignUp').style.display = 'block';
        window.localStorage.removeItem('signup-success');
    }
});