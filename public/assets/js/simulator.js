$(document).ready(function() {
    initializeReportsChart("#heartRateChart", generateHeartRateData);
    initializeReportsChart("#bloodOxygenChart", generateOxygenLevelData);
    initializeWeeklyCharts();
    populateSelectDeviceId();
    handleStartSimulationButton();
    handleResetSimulationButton();
});

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

function populateSelectDeviceId() {
    const token = window.sessionStorage.getItem('patient-token');
    $.ajax({
        url: '/patients/profile',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ token }),
        dataType: 'json',
    }).done(function(serverResponse) {
        displaySelectDeviceId(serverResponse);
    }).fail(function(err) {
        console.error('Error fetching device list:', err);
        // Handle the error appropriately
        alert('Error ' + err.status + ' fetching device list: ' + JSON.stringify(err));
    });
}

function handleStartSimulationButton() {
    $('#startSimulationButton').on('click', function(event) {
        event.preventDefault();
        if (checkFieldsForErrors()) {
            $('.form-container').hide();
            generateSimulationGraph();
            $('#simulationHeartRateChart').show();
            $('#resetSimulationButton').show();
            
        }
    });
}

function checkFieldsForErrors() {
    const fields = [
        { id: '#deviceId', message: 'Device ID is required.' },
        { id: '#startDate', message: 'Start date is required.' },
        { id: '#endDate', message: 'End date is required.' },
        { id: '#interval', message: 'Interval is required and must be a number.' }
    ];
    let errorMessage = '';

    for (const field of fields) {
        const value = $(field.id).val();
        if (!value || (field.id === '#interval' && isNaN(value))) {
            errorMessage += field.message + '\n';
            $(field.id).focus();
            break;
        }
    }

    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        errorMessage += 'End date must be greater than start date.\n';
        $('#endDate').focus();
    }

    if (errorMessage) {
        $('.errorDiv').show();
        $('.errorMessage').text(errorMessage);
        return false;
    } else {
        $('.errorDiv').hide();
        return true;
    }
}

function generateSimulationGraph() {
    const deviceId = $('#deviceId').val();
    const startDate = parseDateTime($('#startDate').val());
    const endDate = parseDateTime($('#endDate').val());
    const interval = parseInt($('#interval').val());

    // Generate data for the graph based on form values
    const data = generateGraphData(startDate, endDate, interval);

    new ApexCharts(document.querySelector("#simulationHeartRateChart"), {
        series: [{
            name: 'Simulated Heart Rate',
            data: data,
        }],
        chart: {
            height: 350,
            type: 'area',
            toolbar: {
                show: true
            }
        },
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

function parseDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
    const tucsonOffset = -7 * 60; // Tucson is UTC-7
    const tucsonDate = new Date(utcDate.getTime() + (tucsonOffset * 60000));
    return tucsonDate;
}

function generateGraphData(startDate, endDate, interval) {
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

function displaySelectDeviceId(serverResponse) {
    const selectDeviceId = $('#deviceId');
    selectDeviceId.empty();
    selectDeviceId.append('<option value="">Select Device ID</option>');
    const deviceList = serverResponse.patientProfile.devices;
    for (let i = 0; i < deviceList.length; i++) {
        const deviceOption = `<option value="${deviceList[i]}">${deviceList[i]}</option>`;
        selectDeviceId.append(deviceOption);
    }
}

function validateForm() {
    let isValid = true;
    let errorMessage = '';

    const deviceId = $('#deviceId').val();
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();
    const interval = $('#interval').val();

    if (!deviceId) {
        isValid = false;
        errorMessage += 'Please select a device.\n';
    }
    if (!startDate) {
        isValid = false;
        errorMessage += 'Please select a start date and time.\n';
    }
    if (!endDate) {
        isValid = false;
        errorMessage += 'Please select an end date and time.\n';
    }
    if (!interval) {
        isValid = false;
        errorMessage += 'Please enter an interval.\n';
    }

    if (!isValid) {
        $('.errorDiv').show();
        $('.errorMessage').text(errorMessage);
    } else {
        $('.errorDiv').hide();
    }

    return isValid;
}

function handleResetSimulationButton() {
    $('#resetSimulationButton').on('click', function() {
        $('#simulationHeartRateChart').hide();
        $('#resetSimulationButton').hide();
        $('.form-container').show();
        clearFields();
    });
}

function clearFields() {
    $('#deviceId').val('').focus();
    $('#startDate').val('');
    $('#endDate').val('');
    $('#interval').val('');
    clearErrorMessage();
}

function clearErrorMessage() {
    $('.errorDiv').hide();
}