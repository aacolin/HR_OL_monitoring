// Sample event data
const events = [
  {
    eventName: "sensor_reading",
    eventDate: "2024-12-03",
    location: "Device-1",
    description: "Heart rate and SpO2 sensor data captured",
    time: "2024-12-03T12:45:00Z",
    deviceDate: "12:45:00Z",
    heartRate: 80,
    SpO2: 95
  },
  {
    eventName: "sensor_reading",
    eventDate: "2024-12-02",
    location: "Device-2",
    description: "Heart rate and SpO2 sensor data captured",
    time: "2024-12-02T10:30:00Z",
    deviceDate: "10:30:00Z",
    heartRate: 85,
    SpO2: 96
  },
  {
    eventName: "sensor_reading",
    eventDate: "2024-12-05",
    location: "Device-3",
    description: "Heart rate and SpO2 sensor data captured",
    time: "2024-12-05T14:00:00Z",
    deviceDate: "14:00:00Z",
    heartRate: 78,
    SpO2: 97
  }
];

// Sorting events by eventDate (ascending order)
events.sort((a, b) => {
  return new Date(a.eventDate) - new Date(b.eventDate);
});

// Log the sorted events
console.log(events);

