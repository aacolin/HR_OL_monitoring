var e***REMOVED***press = require('e***REMOVED***press');
var router = e***REMOVED***press.Router();
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const fs = require('fs');
const secret = fs.readFileSync(__dirname + '/../jwt/secret').toString();
const Patient = require('../models/patient');

// ---------------------------- SignUp route ----------------------------
router.post('/signup', async function(req, res) {
    try {
        const { FirstName, LastName, Email, Password } = req.body;
        const patientE***REMOVED***ist = await Patient.findOne({ email: Email });
        if (patientE***REMOVED***ist) {
            return res.status(409).json({ message: 'A patient with this email address already e***REMOVED***ists. Please use a different email address.' });
        }
        const hashedPassword = await bcrypt.hash(Password, 10);
        const newPatient = new Patient({
            firstName: FirstName,
            lastName: LastName,
            email: Email,
            hashedPassword: hashedPassword
        });
        // Save the new patient record to the database.
        await newPatient.save();
        const token = jwt.encode({ patientEmail: Email }, secret);
        return res.status(201).json({ message: 'patient account created successfully.', patientToken: token });
    } catch (err) {
        console.error('Error in /patients/signup:', err);
        // Handle validation errors from Mongoose, such as missing required fields or invalid data formats.
        if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: 'Your request contains invalid data or missing fields. Please correct and try again.', errors: err.errors });
        }
        // Catch any other unhandled errors and treat them as server errors.
        return res.status(500).json({ message: 'An une***REMOVED***pected error occurred on the server while processing your request.' });
    }
});

module.e***REMOVED***ports = router;
