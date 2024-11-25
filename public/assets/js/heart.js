$(document).ready(function() {
    handleTokenValidation();
    setupLogoutHandler();
    initializeReportsChart();
});

function initializeReportsChart() {
    new Ape***REMOVED***Charts(document.querySelector("#heartRateChart"), {
        series: [{
            name: 'Sales',
            data: [31, 40, 28, 51, 42, 82, 56],
        }, {
            name: 'Revenue',
            data: [11, 32, 45, 32, 34, 52, 41]
        }, {
            name: 'Customers',
            data: [15, 11, 32, 18, 9, 24, 11]
        }],
        chart: {
            height: 350,
            type: 'area',
            toolbar: {
                show: false
            },
        },
        markers: {
            size: 4
        },
        colors: ['#4154f1', '#2eca6a', '#ff771d'],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.4,
                stops: [0, 90, 100]
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        ***REMOVED***a***REMOVED***is: {
            type: 'datetime',
            categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
        tooltip: {
            ***REMOVED***: {
                format: 'dd/MM/yy HH:mm'
            },
        }
    }).render();

    new Ape***REMOVED***Charts(document.querySelector("#bloodO***REMOVED***ygenChart"), {
        series: [{
            name: 'O***REMOVED***ygen Levels',
            data: [95, 96, 97, 98, 99, 100, 99],
        }],
        chart: {
            height: 350,
            type: 'area',
            toolbar: {
                show: false
            },
        },
        markers: {
            size: 4
        },
        colors: ['#2eca6a'],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.4,
                stops: [0, 90, 100]
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        ***REMOVED***a***REMOVED***is: {
            type: 'datetime',
            categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
        tooltip: {
            ***REMOVED***: {
                format: 'dd/MM/yy HH:mm'
            },
        }
    }).render();
}

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
        displayPatientProfile(patient);
    })
    .fail(function(err) {
        console.log('Error:', err);
    });
}

function displayPatientProfile(patient) {
    const patientFullName = `${patient.firstName} ${patient.lastName}`;
    $('.patientFullName').te***REMOVED***t(patientFullName);
}