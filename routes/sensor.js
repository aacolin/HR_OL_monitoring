var e***REMOVED***press = require("e***REMOVED***press");
var router = e***REMOVED***press.Router();
var bodyParser = require("body-parser");

var Patient = require("../models/patient");

// Middleware to parse JSON
router.use(bodyParser.json());

// Handle POST request
// remove it later, comes after login
router.post("/create", async (req, res) => {
  // Destructure only the patient-related fields from req.body
  const { firstName, lastName, email, physicianEmail, password,deviceId } = req.body;

  // Debug: Print the received data (Patient-related fields)
  console.log('Received data for patient creation:', req.body);

  try {
    // Create a new Patient instance with the patient-related data from req.body
    const newPatient = new Patient({
      firstName: firstName,           // First name passed in the request
      lastName: lastName,             // Last name passed in the request
      email: email,                   // Email passed in the request
      physicianEmail: physicianEmail, // Physician's email passed in the request
      password: password,             // Password passed in the request
      lastAccess: Date.now(),          // Set the current timestamp as lastAccess
      deviceId : deviceId
    });

    // Save the new patient to the database
    await newPatient.save();

    // Send success response
    res.status(201).json({ message: "Patient created successfully", patient: newPatient });

  } catch (err) {
    console.error("Error creating patient:", err);
    res.status(500).json({ message: "Error creating patient" });
  }
});


// gets the data as event and logs in DB
// use this
router.post('/receiveEvent', async (req, res) => {
  try {
    // The incoming event data
    const { event, data, published_at, coreid } = req.body;
    console.log("DeviceId" + JSON.stringify(coreid));

    // Check if the incoming data is correctly structured
    if (!data) {
      return res.status(400).json({ message: 'Missing event data' });
    }

    // Parse the JSON data from the `data` field (it is a stringified JSON)
    const eventData = JSON.parse(data);

    // E***REMOVED***tract event details from the incoming data
    const { heartBeat, O2Lvl, deviceName } = eventData;
    console.log("eventData" + JSON.stringify(eventData));

    // Find the patient by a hardcoded name (John Doe in this case)
    // const patient = await Patient.findOne({ firstName: 'Ashish', lastName: 'Khadka' });
    const patient = await Patient.findOne({deviceId : coreid });
    if (!patient) {
      console.log(`${coreid} Device ID not registered to the user`);

      return res.status(404).json({ message: `${coreid}  not found` });
    }

    // Prepare event data to be added
    const newEvent = {
      eventName: event || 'sensor_reading',  // Default to 'sensor_reading' if not provided
      eventDate: new Date(published_at).toISOString().split('T')[0],  // Use event's published date
      location: deviceName || 'Unknown Device',
      description: 'Heart rate and SpO2 sensor data captured',
      time: new Date(published_at).toISOString().split('T')[0], // "2024-12-03",  // Timestamp of when the event occurred  // need to work on it
      deviceDate: new Date(published_at).toISOString().split('T')[1],  // "2024-12-03",  // Device timestamp  // need to work on it
      heartRate: heartBeat,  // heartBeat from the event data
      SpO2: O2Lvl,  // O2Lvl from the event data
    };

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


// works for hardcoded name , create new name in DB
// get rid of it
router.post('/save', async (req, res) => {
  try {
    const newPatient = new Patient({
      firstName:       'Ashish',
      lastName:        'Khadka',
      email:           'khadka***REMOVED***ashish@arizona.com',
      physicianEmail:  'myPhysician@gmail.cm',
      password:        '123',
     // lastAccess:     Date.now
    });
    // Save the new instance to the database
    const savedData = await newPatient.save();

    // Send a success response with the saved data
    res.status(201).json({
      message: 'Data saved successfully!',
      data: savedData,
    });
  } catch (err) {
    // Handle any errors during saving
    res.status(500).json({
      message: 'Error saving data',
      error: err.message,
    });
  }
});


// my old method  , no db in use
//get rid of it
router.post("/data", (req, res) => {
  const { avgHeartBeat, o2Lvl, deviceName } = req.body;
  // Debug print,  the received data
  console.log('Received data from sensor router:', req.body);
  // Respond with JSON data
  res.status(200).json({
    message: 'Data received successfully',
    avgHeartBeat : avgHeartBeat,
    o2Lvl : o2Lvl,
    deviceName : deviceName ,
  });
});





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



module.e***REMOVED***ports = router;
