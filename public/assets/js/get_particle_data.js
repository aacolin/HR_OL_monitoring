// Your Particle Cloud API credentials
const accessToken = 'API_KEY'; // Replace with your access token
const deviceId = 'e00fce68d3b6b43244c35726'; // Replace with your device ID


// URL to Particle Cloud API endpoint for fetching a variable (e.g., temperature)
//const url = `https://api.particle.io/v1/devices/${deviceId}/temperature?access_token=${accessToken}`;
const url = `https://api.particle.io/v1/devices/${deviceId}/randNum`;
//const url = `https://api.particle.io/v1/devices/${deviceId}/simpleVar`

// Make the GET request using the fetch() API
fetch(url, {
  method: 'GET', // HTTP method for getting a variable
  headers: {
    'Authorization': `Bearer ${accessToken}` // Use the access token for authorization
  }
})
  .then(response => response.json()) // Parse the JSON response from the Particle Cloud
  .then(data => {
    console.log('Fetched Variable Data:', data); // Log the entire variable data to the console
    if (data && data.result) {
      console.log('Random Numb:', data.result); // Log the actual value of the variable (e.g., temperature)
    }
  })
  .catch(error => {
    console.error('Error Fetching Variable:', error); // Handle any errors
  });
// URL to Particle Cloud API endpoint for fetching events
//const url = `https://api.particle.io/v1/devices/${deviceId}/events`;

// Make the GET request using the fetch() API
fetch(url, {
  method: 'GET', // HTTP method for fetching events
  headers: {
    'Authorization': `Bearer ${accessToken}` // Use the access token for authorization (no need for it in URL)
  }
})
  .then(response => response.json()) // Parse the JSON response from the Particle Cloud
  .then(data => {
    console.log('Fetched Events:', data); // Log the event data to the console
    // Optional: You can also log specific parts of the data
    if (Array.isArray(data)) {
      data.forEach(event => {
        console.log('Event Name:', event.name);
        console.log('Event Data:', event.data);
        console.log('Event Timestamp:', event.published_at);
      });
    }
  })
  .catch(error => {
    console.error('Error Fetching Events:', error); // Handle any errors
  });

