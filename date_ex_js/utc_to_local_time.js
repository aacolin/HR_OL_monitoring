// 1. Get the current UTC time
const utcDate = new Date();
console.log("UTC Time:", utcDate.toISOString()); // UTC time in ISO format

// 2. Convert UTC time to local time
const localTime = new Date(utcDate); // No conversion needed, Date handles this
console.log("Local Time:", localTime.toLocaleString()); // Local time (user's time zone)

// 3. Optionally, format the local time (custom format)
const formattedLocalTime = localTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
});
console.log("Formatted Local Time:", formattedLocalTime);

