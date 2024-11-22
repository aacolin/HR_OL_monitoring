var e***REMOVED***press = require("e***REMOVED***press");
var router = e***REMOVED***press.Router();
var bodyParser = require("body-parser");

//var Student = require("../models/patient");

// Middleware to parse JSON
router.use(bodyParser.json());

// Handle POST request
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

module.e***REMOVED***ports = router;
