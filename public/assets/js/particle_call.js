// Your Particle Cloud API credentials
const accessToken = 'accessToken-here'; // Replace with your access token
const deviceId = 'deviceId-here'; // Replace with your device ID

// URL to Particle Cloud API endpoint for calling a function on your device
//const url = `https://api.particle.io/v1/devices/${deviceId}/function_name`;
const url = `https://api.particle.io/v1/devices/${deviceId}/randNum`;

// The data you want to send (this will depend on the function you're calling)
const data = {
  arg1: 'value1' // Argument 1 (replace with actual parameter names and values)
 // arg2: 'value2'  // Argument 2 (replace with actual parameter names and values)
};

// Make the AJAX request using the fetch() API
fetch(url, {
  method: 'GET', // Typically for calling a function or writing to the device
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}` // Your Particle Cloud access token
  },
 head: JSON.stringify(data) // Convert data to JSON string
})
  .then(response => response.json()) // Parse the JSON response
  .then(data => {
    console.log('Success:', data); // Handle the successful response
  })
  .catch(error => {
    console.error('Error:', error); // Handle any errors
  });

