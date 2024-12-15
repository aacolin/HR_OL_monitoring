#!/bin/bash

# Base URL of the server
BASE_URL="http://localhost:3000/sensor/receiveEvent"

# Function to generate random heart rate and SpO2 levels
generate_random_data() {
  heartBeat=$((RANDOM % 50 + 90))  # Random heart rate between 60 and 110
  O2Lvl=$((RANDOM % 10 + 90))     # Random O2 Level between 90 and 100
  deviceName="Device-$(($RANDOM % 5 + 1))"  # Random device name (e.g., Device-1, Device-2)
  
  # Return the values as a comma-separated string
  echo "$heartBeat,$O2Lvl,$deviceName"
}


#step 0
curl -X POST http://localhost:3000/sensor/deleteAll

# Step 1: Register the device/user (send POST request for creating the user)
echo "Registering device/user..."
curl -X POST http://localhost:3000/sensor/create \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John", 
    "lastName": "Doe", 
    "email": "john.doe@e***REMOVED***ample.com", 
    "physicianEmail": "physician@e***REMOVED***ample.com", 
    "password": "securepassword123",
    "deviceId": "johndoedevice123"
  }'

  

# Loop to send multiple events (e.g., 10 events)
for i in {1..2}; do
  # Get the generated data and split into separate variables
  IFS=',' read -r heartBeat O2Lvl deviceName <<<$(generate_random_data)
  
  # Ensure that variables are properly assigned
  echo "Generated data - heartBeat: $heartBeat, O2Lvl: $O2Lvl, deviceName: $deviceName"

  # Get the current timestamp (published_at)
  published_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  

  # Prepare the JSON payload with proper escaping
  json_payload=$(cat <<EOF
{
  "event": "ma***REMOVED***30102_data_capture_event",
  "data": "{\"heartBeat\": \"$heartBeat\", \"O2Lvl\": \"$O2Lvl\", \"deviceName\": \"$deviceName\"}",
  "published_at": "$published_at",
  "coreid": "johndoedevice123"
}
EOF
)

  # Send the data using curl
  echo "Sending event #$i: $json_payload"
  
  # Use curl to send the POST request to the server
  curl -X POST "$BASE_URL" -H "Content-Type: application/json" -d "$json_payload"
  
  # Wait 1 second before sending the ne***REMOVED***t event
  sleep 5
done
