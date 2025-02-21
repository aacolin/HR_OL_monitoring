$(document).ready(function() {
    const localStorageToken = window.localStorage.getItem('physician-token');
    const sessionToken = window.sessionStorage.getItem('physician-token');
    handleTokenValidation(localStorageToken, sessionToken);
    requestPatientsList();
    handleDropDownPatientsList();
    setupLogoutHandler();
});



function handleTokenValidation(localStorageToken, sessionToken) {
 
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
    }).done(function() {
        document.body.classList.remove('hidden');
        getPhysicianProfile(token); 
    }).fail(function(err) {
        handleTokenValidationError();
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
        displayPhysicianProfile(data);

    })
    .fail(function(err) {
        console.log('Error:', err);
    });
}

function displayPhysicianProfile(data) {
    const profile = data.profile;
    const physicianName = profile.firstName + ' ' + profile.lastName;
    $('#physicianFullName').text(physicianName);
    $('#physicianProfileName').text("Welcome Dr. " + physicianName);
}

function handleTokenValidationError() {
    window.localStorage.removeItem('physician-token');
    redirectToHomePage();
}

function redirectToHomePage() {
    window.location.href = '/home.html';
}

function handleDropDownPatientsList() {
    // changle on click for on selection

    $('.dropdown-menu').on('click', '.dropdown-item', function(event) {
        event.preventDefault();

        const patientEmail = $(event.target).data('email');
        const patientName = $(event.target).text();
        displayPatientGraphs(patientEmail, patientName);
    });

  
}

function displayPatientGraphs(patientEmail, patientName){

    //generate the graphs for the patient
    generateDailyGraphs();
    generateWeeklyGraphs();

    $('#patientNameCard').text("Patient: " + patientName);
    $('#patientGraphs').show();
}

function generateDailyGraphs() {
    initializeReportsChart("#heartRateChart", generateHeartRateData);
    initializeReportsChart("#bloodOxygenChart", generateOxygenLevelData);

}

function generateWeeklyGraphs() {
    initializeWeeklyCharts();
}


function initializeReportsChart(target, dataGenerator) {
    const startDate = new Date();
    startDate.setHours(6, 0, 0, 0); // Set to 6:00 AM
    const endDate = new Date(); // Current time
    const interval = 30; // Interval in minutes

    // Generate data for the graph based on current day
    const data = dataGenerator(startDate, endDate, interval);

    new ApexCharts(document.querySelector(target), {
        series: [{
            name: target === "#heartRateChart" ? 'Heart Rate' : 'Oxygen Levels',
            data: data,
        }],
        chart: {
            height: 350,
            type: 'area',
            toolbar: {
                show: true
            }
        },
        colors: [target === "#heartRateChart" ? '#ff0000' : '#4154f1'], // Red for heart rate, blue for oxygen levels
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function(value, timestamp) {
                    const date = new Date(timestamp);
                    date.setHours(date.getHours() - 7); // Adjust for 7-hour offset
                    const time = date.toISOString().slice(11, 16); // Show only the time
                    const day = date.toISOString().slice(0, 10); // Show the date
                    return date.getHours() === 0 ? `${day} ${time}` : time; // Show date when it's a new day
                }
            }
        }
    }).render();
}

function initializeWeeklyCharts() {
    const weeklyHeartRateData = generateWeeklyData(generateRandomHeartRate);
    const weeklyOxygenData = generateWeeklyData(generateRandomWeeklyOxygenLevel);

    new ApexCharts(document.querySelector("#weeklyHeartRateChart"), {
        series: [{
            name: 'Weekly Heart Rate',
            data: weeklyHeartRateData,
        }],
        chart: {
            height: 350,
            type: 'line',
            toolbar: {
                show: true
            }
        },
        colors: ['#71f5a5'], // Green for heart rate
        xaxis: {
            type: 'datetime',
            min: new Date().setDate(new Date().getDate() - 6), // Start from 6 days ago
            max: new Date().getTime(), // End at current time
            labels: {
                formatter: function(value) {
                    const date = new Date(value);
                    return date.toLocaleString('en-US', { weekday: 'long' }); // Show day name
                }
            },
            tickAmount: 6 // Ensure there are exactly 6 ticks on the x-axis
        },
        dataLabels: {
            enabled: true, // Enable data labels
            formatter: function(value) {
                return value.toFixed(2); // Format the value to 2 decimal places
            }
        }
    }).render();

    new ApexCharts(document.querySelector("#weeklyOxygenChart"), {
        series: [{
            name: 'Weekly Oxygen Levels',
            data: weeklyOxygenData,
        }],
        chart: {
            height: 350,
            type: 'line',
            toolbar: {
                show: true
            }
        },
        colors: ['#41acf1'], // Blue for oxygen levels
        xaxis: {
            type: 'datetime',
            min: new Date().setDate(new Date().getDate() - 6), // Start from 6 days ago
            max: new Date().getTime(), // End at current time
            labels: {
                formatter: function(value) {
                    const date = new Date(value);
                    return date.toLocaleString('en-US', { weekday: 'long' }); // Show day name
                }
            },
            tickAmount: 6 // Ensure there are exactly 6 ticks on the x-axis
        },
        dataLabels: {
            enabled: true, // Enable data labels
            formatter: function(value) {
                return value.toFixed(2); // Format the value to 2 decimal places
            }
        }
    }).render();
}

function generateWeeklyData(dataGenerator) {
    let data = [];
    let currentTime = new Date();

    for (let i = 0; i < 7; i++) {
        data.push({
            x: currentTime.toISOString(),
            y: dataGenerator()
        });
        currentTime.setDate(currentTime.getDate() - 1);
    }

    return data.reverse(); // Reverse to show the last 7 days starting from the current day
}

function generateHeartRateData(startDate, endDate, interval) {
    let data = [];
    let currentTime = new Date(startDate);

    while (currentTime <= endDate) {
        data.push({
            x: currentTime.toISOString(),
            y: generateRandomHeartRate()
        });
        currentTime = new Date(currentTime.getTime() + interval * 60000);
    }

    return data;
}

function generateOxygenLevelData(startDate, endDate, interval) {
    let data = [];
    let currentTime = new Date(startDate);

    while (currentTime <= endDate) {
        data.push({
            x: currentTime.toISOString(),
            y: generateRandomOxygenLevel()
        });
        currentTime = new Date(currentTime.getTime() + interval * 60000);
    }

    return data;
}

function generateRandomHeartRate() {
    const steadyRate = 75;
    const highRate = 120;
    const steadyVariance = 5;
    const highVariance = 5;
    const steadyPeriod = 0.8; // 80% of the time
    const highPeriod = 0.2; // 20% of the time

    if (Math.random() < steadyPeriod) {
        return Math.floor(Math.random() * (steadyVariance * 2 + 1) + (steadyRate - steadyVariance));
    } else {
        return Math.floor(Math.random() * (highVariance * 2 + 1) + (highRate - highVariance));
    }
}

function generateRandomOxygenLevel() {
    const baseline = 98;
    const minRate = 94;
    const baselineVariance = 2;
    const minVariance = 4;
    const baselinePeriod = 0.8; // 80% of the time
    const minPeriod = 0.2; // 20% of the time

    if (Math.random() < baselinePeriod) {
        return Math.floor(Math.random() * (baselineVariance * 2 + 1) + (baseline - baselineVariance));
    } else {
        return Math.floor(Math.random() * (minVariance * 2 + 1) + (minRate - minVariance));
    }
}

function generateRandomWeeklyOxygenLevel() {
    const baseline = 98;
    const minRate = 94;
    const baselineVariance = 2;
    const minVariance = 3;
    const baselinePeriod = 0.8; // 80% of the time
    const minPeriod = 0.2; // 20% of the time

    if (Math.random() < baselinePeriod) {
        return Math.floor(Math.random() * (baselineVariance * 2 + 1) + (baseline - baselineVariance));
    } else {
        return Math.floor(Math.random() * (minVariance * 2 + 1) + (minRate - minVariance));
    }
}


function requestPatientsList() {
    const sessionToken = window.sessionStorage.getItem('physician-token');

    $.ajax({
        url: '/physicians/profile',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ token: sessionToken }),
        dataType: 'json',
    })
    .done(function(data) {
        const physicianEmail = data.profile.email;
        $.ajax({
            url: '/patients/patients-list',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email: physicianEmail }),
            dataType: 'json',
        })
        .done(function(data) {
            displayPatientsList(data.patients);
        })
        .fail(function(err) {
            console.log('Error:', err);
        });
    })
    .fail(function(err) {
        console.log('Error:', err);
    });
}

function displayPatientsList(patients) {
    const patientsList = $('#dropdownPatientsList'); // Ensure the ID matches the HTML element
    patientsList.empty();
    patients.forEach(function(patient) {
        const patientName = `${patient.firstName} ${patient.lastName}`;
        const patientEmail = patient.email;

        // Append patientName to the dropdown list 
        // also add the patient email as a data attribute but dont show it
        patientsList.append(`<a class="dropdown-item" href="#" data-email="${patientEmail}">${patientName}</a>`);
        // patientsList.append(`<a class="dropdown-item" href="#">${patientName}</a>`);
    });
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

