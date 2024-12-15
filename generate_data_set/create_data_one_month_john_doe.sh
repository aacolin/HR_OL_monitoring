#!/bin/bash

# Base URL of the server
BASE_URL="http://localhost:3000/sensor/receiveEvent"

# Function to generate random heart rate and SpO2 levels
generate_random_data() {
  heartBeat=$((RANDOM % 50 + 90))  # Random heart rate between 90 and 140
  O2Lvl=$((RANDOM % 10 + 90))     # Random O2 Level between 90 and 100
  deviceName="Device-$(($RANDOM % 5 + 1))"  # Random device name (e.g., Device-1, Device-2)
  
  # Return the values as a comma-separated string
  echo "$heartBeat,$O2Lvl,$deviceName"
}

# Starting timestamp (set to current time)
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
#published_at: The timestamp of when the event was published, in ISO 8601 format (UTC).


#
# Calculate total number of events in a week (7 days * 48 events/day)
total_events=$((7 * 24 * 2))  # 7 days * 48 events per day = 336 events

# Loop to send multiple events (e.g., 336 events for a full week)
for i in $(seq 1 $total_events); do
  # Get the generated data and split into separate variables
  IFS=',' read -r heartBeat O2Lvl deviceName <<<$(generate_random_data)
  
  # Ensure that variables are properly assigned
  echo "Generated data - heartBeat: $heartBeat, O2Lvl: $O2Lvl, deviceName: $deviceName"

  # Prepare the JSON payload with proper escaping
  json_payload=$(cat <<EOF
{
  "event": "ma***REMOVED***30102_data_capture_event",
  "data": "{\"heartBeat\": \"$heartBeat\", \"O2Lvl\": \"$O2Lvl\", \"deviceName\": \"$deviceName\"}",
  "published_at": "$timestamp",
  "coreid": "johndoedevice123"
}
EOF
)

  # Send the data using curl
  echo "Sending event #$i: $json_payload"
  
  # Use curl to send the POST request to the server
  curl -X POST "$BASE_URL" -H "Content-Type: application/json" -d "$json_payload"
  
  # Wait 1 second before sending the ne***REMOVED***t event
  sleep 1
  
  # Increment timestamp by 30 minutes (1800 seconds)
  timestamp=$(date -u -d "$timestamp + 30 minutes" +"%Y-%m-%dT%H:%M:%SZ")
done
