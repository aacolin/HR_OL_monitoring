var e***REMOVED***press = require("e***REMOVED***press");
var router = e***REMOVED***press.Router();
var bodyParser = require("body-parser");

var Patient = require("../models/patient");

// Middleware to parse JSON
router.use(bodyParser.json());

// END point for IOT Device
router.post("/data", async (req, res) => {
  try {
    // The incoming event data
    const { event,  data, published_at, coreid } = req.body;
    console.log("DeviceId" + JSON.stringify(coreid));

    // Check if the incoming data is correctly structured
    if (!data) {
      return res.status(400).json({ message: 'Missing event data' });
    }

    // Parse the JSON data from the `data` field (it is a stringified JSON)
    const eventData = JSON.parse(data);

    // E***REMOVED***tract event details from the incoming data
    const { heartBeat, O2Lvl, sampledTime } = eventData;
    console.log("eventData" + JSON.stringify(eventData));

    // Find the patient by a hardcoded name (John Doe in this case)
    // const patient = await Patient.findOne({ firstName: 'Ashish', lastName: 'Khadka' });
    const patient = await Patient.findOne({devices : coreid });
    if (!patient) {
      console.log(`${coreid} Device ID not registered to the user`);

      return res.status(404).json({ message: `${coreid}  not found` });
    }

    // Prepare event data to be added
    const newEvent = {
      eventName: event || 'sensor_reading',  // Default to 'sensor_reading' if not provided
      published_at : new Date(published_at),
      eventDescription: 'Heart rate and SpO2 sensor data captured',
      sampledTime : sampledTime,
      eventPublishedTime: new Date(published_at).toISOString().split('T')[1], // "2024-12-03",  // Timestamp of when the event occurred  // need to work on it
      eventPublishedDate: new Date(published_at).toISOString().split('T')[0], 
      heartRate: heartBeat,  // heartBeat from the event data
      SpO2: O2Lvl,  // O2Lvl from the event data
    };
    console.log(newEvent);
    // Ensure events field is an array and push the new event data
    if (!Array.isArray(patient.events)) {
      patient.events = [];
    }

    patient.events.push(newEvent);

    // Save the updated patient document with the new event
    await patient.save();

    // Respond with success and the event data
    res.status(200).json({
      message: 'Event added successfully',
      eventData: newEvent,
    });
  } catch (err) {
    console.error('Error processing event data:', err);
    res.status(500).json({ message: 'Error processing event data', error: err.message });
  }
});

// read all For debug and test
// for DEV and troubleshooitng
router.get('/readAll', async function (req, res) {
  try {
    // Fetch all patients from the database
    const patients = await Patient.find();

    // If no patients are found, return an appropriate message
    if (!patients || patients.length === 0) {
      return res.status(404).json({ message: "No patients found" });
    }
    console.log(JSON.stringify(patients, null,2));
    // Return the list of patients if found
    res.status(200).json(patients);

  } catch (err) {
    // Handle errors (e.g., database issues)
    console.error("Error fetching patients:", err);
    res.status(500).json({ message: "Something went wrong. Could not fetch patients." });
  }
});


// dalily graph different apporach
router.get('/usrDayLogOl', async (req, res) => {
    console.log(aDay);
    singleDayQuery = new Date(aDay).toISOString().split('T')[0];
    
    console.log("single Day query is running for " + singleDayQuery);
    try {
        // Query to find patients with events where published_at is between startDate and endDate
        const result = await Patient.find({ 'events.eventPublishedDate': singleDayQuery});
        const results = [];
        await result.forEach(doc => { results.push(doc);});
        console.log(JSON.stringify(results,null,2));
        res.json(results); // Send the result back to the frontend
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching events.');
    } });

// get Daily log
// Still wowking on it, query gives all the data
 router.get('/usrDayLog', async (req, res) => {
    const { aDay, deviceId } = req.query; // Assume you pass startDate and endDate in query params as ISO strings
 
    // If aDay is not provided, use the current date (UTC)
    const dateToUse = aDay ? new Date(aDay) : new Date();

    // Go 5 days back from the chosen date
    dateToUse.setUTCDate(dateToUse.getUTCDate() - 5);  // Subtract 5 days

    // Now, set the start and end of that day (midnight to just before the ne***REMOVED***t midnight)
    const startOfDay = new Date(dateToUse);
    startOfDay.setUTCHours(0, 0, 0, 0);  // Midnight UTC

    const endOfDay = new Date(dateToUse);
    endOfDay.setUTCHours(23, 59, 59, 999);  // Just before midnight UTC on the same day

    console.log('Start of 5 days ago:', startOfDay);
    console.log('End of 5 days ago:', endOfDay);

    try {
        // Query to find patients with events where published_at is between startOfDay and endOfDay
        const result = await Patient.find({
            'events.published_at': {
                $gte: startOfDay,  // Greater than or equal to the start of the day (in UTC)
                $lt: endOfDay      // Less than the start of the ne***REMOVED***t day (before midnight UTC)
            }
        });

        // Log the result to ensure we are getting the correct data
        console.log('Query Result:', result);

        // If there are results, send them back to the client
        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).send('No events found for the given date range.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching events.');
    }
});


// front end graph test
router.get('/plotData', async (req, res) => {
  try {
    // Access deviceId using req.header() correctly
    const deviceId = req.query.deviceId;  // Correct method to access headers in E***REMOVED***press

    // Log the deviceId to confirm
    console.log("Received Device Id: " + deviceId);

    const patientData = await Patient.find({ deviceId : req.query,deviceId}); // Fetch all data from SensorData collection
    if (patientData.length === 0) {
      return res.status(404).json({ message: 'No data found for the given deviceId' });
    }
    console.log(JSON.stringify(patientData,null,2));
   return res.json(patientData); // Send data to frontend
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching data' });
  }
});



// debug api to drop the DB
router.post("/deleteAll", async function(req, res) {
  try {
      // Delete all records in the weatherRecording collection
      const result = await Patient.deleteMany({});

      // Check how many records were deleted
      if (result.deletedCount > 0) {
          res.status(200).json({ message: `Successfully deleted ${result.deletedCount} records.` });
      } else {
          res.status(404).json({ message: "No records found to delete." });
      }
  } catch (err) {
      console.error("Error deleting records:", err);
      res.status(500).json({ message: "Something went wrong while deleting the records." });
  }
});


// somthing to ry for, internet idea 
router.get('/getDataByTimePeriod', async (req, res) => {
  const { timePeriod, deviceId } = req.query;

  let groupByField;
  
  console.log( "inside sensor/getDataByTimePriod");
  switch (timePeriod) {
    case 'daily':
      groupByField = { $dateToString: { format: "%Y-%m-%d", date: "$events.published_at" } }; // Group by date
      break;
    case 'weekly':
      groupByField = { $week: "$events.published_at" }; // Group by week number
      break;
    case 'monthly':
      groupByField = { $month: "$events.published_at" }; // Group by month
      break;
    default:
      return res.status(400).send({ message: 'Invalid time period' });
  }

  try {
    const data = await Patient.aggregate([
      { $match: { deviceId: deviceId } },
      { $unwind: '$events' },
      {
        $group: {
          _id: groupByField,
          avgHeartRate: { $avg: '$events.heartRate' },
          avgSpO2: { $avg: '$events.SpO2' },
        },
      },
      { $sort: { _id: 1 } },  // Sort by time period
    ]);

    const formattedData = data.map(item => ({
      timestamp: item._id, 
      heartRate: item.avgHeartRate,
      SpO2: item.avgSpO2,
    }));

    res.json({ data: formattedData });
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send({ message: 'Internal server error' });
  }
});


module.e***REMOVED***ports = router;
