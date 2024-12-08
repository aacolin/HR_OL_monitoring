function getDateRanges(rangeType) {
    const now = new Date();
    console.log("Calculating Range for " + rangeType);
    let startDate, endDate;

    if (rangeType === 'day') {
        // For a single day
        startDate = new Date(now.setHours(0, 0, 0, 0)); // Start of today
        endDate = new Date(now.setHours(23, 59, 59, 999)); // End of today
    } else if (rangeType === 'week') {
        // Get the start of the current week (Sunday)
        const firstDayOfWeek = now.getDate() - now.getDay(); // Adjust to Sunday
        startDate = new Date(now.setDate(firstDayOfWeek));
        startDate.setHours(0, 0, 0, 0); // Start of the week
        // End of the week (Saturday)
        endDate = new Date(now.setDate(firstDayOfWeek + 6));
        endDate.setHours(23, 59, 59, 999); // End of the week
    } else if (rangeType === 'month') {
        // Start of the current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the month
        startDate.setHours(0, 0, 0, 0); // Start of the month
        // End of the current month
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the month
        endDate.setHours(23, 59, 59, 999); // End of the month
    }
      // console.log("start Date :" + startDate + " stopDate : " + endDate);
    return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
}

// E***REMOVED***ample of how you could use it:
const rangeType = 'day'; // Or 'week', 'month' based on the user selection
//const rangeType = 'week'; // Or 'week', 'month' based on the user selection
//const rangeType = 'year'; // Or 'week', 'month' based on the user selection
const { startDate, endDate } = getDateRanges(rangeType);
console.log("startDate :" + startDate + "stopDate: " + endDate);
// getDateRanges('week');
// getDateRanges('month');

// UTC time to local time in the default locale
var localTime = new Date(startDate)
console.log("Start Local Time:", localTime); // 

localTime = endDate.toLocaleString();
console.log("End Local Time:", localTime); // 
