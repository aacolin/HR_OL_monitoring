const express = require('express');
const router = express.Router();
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const secret = fs.readFileSync(__dirname + '/../jwt/secret').toString();
const Patient = require('../models/patient');
const Physician = require('../models/physician'); // Add this line to import the Physician model

const PatientExists = 'A patient with this email address already exists. Please use a different email address.';
const InvalidData = 'Your request contains invalid data or missing fields. Please correct and try again.'
const ServerError = 'An unexpected error occurred on the server while processing your request please try again later.'
const PatientCreated = 'Patient account created successfully.';
const InvalidUserNameOrPassword = 'Invalid username or password.';
const PatientNotFound = 'Email not found.';
const AllFieldsRequired = 'All fields are required: First Name, Last Name, email, password'



router.get('/token-auth', async function(req, res) {
    
    // check if X-Auth-Token header is present
    if (!req.headers['x-auth']) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const receivedToken = req.headers['x-auth'];
    const tokenDecoded = jwt.decode(receivedToken, secret);
    
    try{
        const patientExist = await Patient.findOne({ email: tokenDecoded.email });
        if (!patientExist) {
            throw new Error('Patient not found');
        }
        else{
            return res.status(200).json({ success: true , message: 'Patient found' });
        }
    }
    catch(err){
        console.log("Error at token auth" + err);
        return res.status(401).json({ message: 'Invalid JWT' });
    }
});


router.post('/signup', async function(req, res) {
    try {    
        const signUpFormData = req.body;
        const requiredFields = ['FirstName', 'LastName', 'Email', 'Password'];
        
        for (const field of requiredFields) {
            if (!signUpFormData[field]) {
                return res.status(400).json({ message: `Missing ${field.replace(/([A-Z])/g, ' $1').trim()}` });
            }
        }
        
        // Additional server-side validation for email and password
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
        if (!emailRegex.test(signUpFormData.Email)) {
            return res.status(400).json({ message: 'Invalid email address.' });
        }
        
        const password = signUpFormData.Password;
        if (password.length < 10 || password.length > 20) {
            return res.status(400).json({ message: 'Password must be between 10 and 20 characters.' });
        }
        if (!/[a-z]/.test(password)) {
            return res.status(400).json({ message: 'Password must contain at least one lowercase character.' });
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ message: 'Password must contain at least one uppercase character.' });
        }
        if (!/[0-9]/.test(password)) {
            return res.status(400).json({ message: 'Password must contain at least one digit.' });
        }
    
        const newPatient = new Patient();
        const hashedPassword = await bcrypt.hash(password, 10);
        Object.assign(newPatient, {
            firstName: signUpFormData.FirstName,
            lastName: signUpFormData.LastName,
            email: signUpFormData.Email,
            password: hashedPassword
        });

        const patientExist = await Patient.findOne({ email: signUpFormData.Email });
        if (patientExist) {
            throw new Error(PatientExists);
        } else {
            await newPatient.save();
            const tokenPayload = { Email: signUpFormData.Email };
            const encodedToken = jwt.encode(tokenPayload, secret);
            return res
                .status(201)
                .json({ message: PatientCreated, patientToken: encodedToken });
        }
    } catch (err) {
        if (err.message === InvalidData) {
            return res
                .status(400)
                .json({ message: InvalidData });
        }
        if (err.message === PatientExists) {
            return res
                .status(409)
                .json({ message: PatientExists });
        } else {
            console.log(err);
            return res
                .status(500)
                .json({ message: ServerError });
        }
    }
});






router.post('/login', async function(req, res) {
    try{
        
        const userEmail = req.body.Email;
        const userPassword = req.body.Password;
        
        // check if the email and password are not empty
        if (!userEmail || !userPassword) {
            throw new Error(InvalidUserNameOrPassword);
        }
      
        //check if the patient exists in the database
        const existingPatient = await Patient.findOne({ email: userEmail });
        if (!existingPatient) {
            throw new Error(PatientNotFound);
        }
        
        const isCorrectPassword = await bcrypt.compare(userPassword,existingPatient.password);
        if (!isCorrectPassword) {
            throw new Error(InvalidUserNameOrPassword);
        }

        if (existingPatient && isCorrectPassword) {
            // console.log("existing patient: " + existingPatient);
            var payload = { email: existingPatient.email };
            let encodedToken = jwt.encode(payload, secret);
            // console.log("encoded token: " + encodedToken);
            return res.status(200).json({ success: true, patientToken: encodedToken});
        }
    }catch(err){
        if (err.message === InvalidUserNameOrPassword) {
            return res
                .status(400)
                .json({ message: InvalidUserNameOrPassword });
        }
        if (err.message === PatientNotFound) {
            return res
                .status(400)
                .json({ message: PatientNotFound });
        } else {
            console.log(err);
            return res
                .status(500)
                .json({ message: ServerError });
        }
    }

});

router.post('/profile', async function(req, res) {
    
    
    const { token } = req.body;
    // console.log("token: " + token);
    if (!token) {
        return res.status(400).json({ message: 'Token not found' });
    }
    
    const tokenDecoded = jwt.decode(token, secret);

    const patienInDatabase = await Patient.findOne({ email: tokenDecoded.email });

    if (!patienInDatabase) {
        return res.status(404).json({ message: 'Patient not found' });
    } else {
        const patientProfile = {
            firstName: patienInDatabase.firstName,
            lastName: patienInDatabase.lastName,
            email: patienInDatabase.email,
            devices: patienInDatabase.devices,
            physicianEmail: patienInDatabase.physicianEmail
        };
        // console.log("Patient profile sent. patientProfile = ", patientProfile);
        return res.status(200).json({ message: 'Patient found', patientProfile: patientProfile });
    }


});

router.put('/profile', async function(req, res) {
    const { token, firstName, lastName } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token not found' });
    }

    const tokenDecoded = jwt.decode(token, secret);
    const patient = await Patient.findOne({ email: tokenDecoded.email });

    if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
    }

    if (!firstName || !lastName) {
        return res.status(400).json({ message: 'First Name and Last Name are required' });
    }

    patient.firstName = firstName;
    patient.lastName = lastName;
    

    try {
        await patient.save();
        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: ServerError });
    }
});

router.put('/change-password', async function(req, res) {
    const { token, currentPassword, newPassword } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token not found' });
    }

    const tokenDecoded = jwt.decode(token, secret);
    const patient = await Patient.findOne({ email: tokenDecoded.email });

    if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
    }

    const isCorrectPassword = await bcrypt.compare(currentPassword, patient.password);
    if (!isCorrectPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (newPassword.length < 10 || newPassword.length > 20) {
        return res.status(400).json({ message: 'Password must be between 10 and 20 characters.' });
    }
    if (!/[a-z]/.test(newPassword)) {
        return res.status(400).json({ message: 'Password must contain at least one lowercase character.' });
    }
    if (!/[A-Z]/.test(newPassword)) {
        return res.status(400).json({ message: 'Password must contain at least one uppercase character.' });
    }
    if (!/[0-9]/.test(newPassword)) {
        return res.status(400).json({ message: 'Password must contain at least one digit.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    patient.password = hashedNewPassword;

    try {
        await patient.save();
        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: ServerError });
    }
});

router.put('/change-physician', async function(req, res) {
    const patientEmail = req.body.patientEmail;
    const physicianEmail = req.body.physicianEmail;

    console.log("physicianEmail: " + physicianEmail);
    console.log("patientEmail: " + patientEmail);

    try {
        const physician = await Physician.findOne({ email: physicianEmail });
        if (!physician) {
            return res.status(404).json({ message: 'Physician not found' });
        }
        const patient = await Patient.findOne({ email: patientEmail });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        patient.physicianEmail = physicianEmail;
        await patient.save();

        return res.status(200).json({ patientProfile: patient, physicianProfile: physician, message: 'Physician changed successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'An unexpected error occurred on the server while processing your request. Please try again later.' });
    }
});

router.put('/change-device', async function(req, res) {
    const { token, deviceId } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token not found' });
    }

    const tokenDecoded = jwt.decode(token, secret);
    const patient = await Patient.findOne({ email: tokenDecoded.email });

    if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
    }

    if (!deviceId) {
        return res.status(400).json({ message: 'Device ID is required' });
    }

    // delete the old device (deviceId) from the patient's devices list 
    const deviceIndex = patient.devices.indexOf(deviceId);
    if (deviceIndex > -1) {
        patient.devices.splice(deviceIndex, 1);
    }

    // add the new device (deviceId) to the patient's devices list at the beginning of the list
    patient.devices.unshift(deviceId);

    try {
        await patient.save();
        return res.status(200).json({ message: 'Device changed successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: ServerError });
    }
});

router.put('/remove-device', async function(req, res) {
    const { token, deviceId } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token not found' });
    }

    const tokenDecoded = jwt.decode(token, secret);
    const patient = await Patient.findOne({ email: tokenDecoded.email });

    if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
    }
    if (!deviceId) {
        return res.status(400).json({ message: 'Device ID is required' });
    }
    
    // delete the old device (deviceId) from the patient's devices list 
    const deviceIndex = patient.devices.indexOf(deviceId);
    if (deviceIndex > -1) {
        patient.devices.splice(deviceIndex, 1);
    }

    try {
        await patient.save();
        return res.status(200).json({ message: 'Device Removed Successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: ServerError });
    }
    
});

router.post('/patients-list', async function(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email not found' });
    }

    try {
        const physician = await Physician.findOne({ email: email });
        if (!physician) {
            return res.status(404).json({ message: 'Physician not found' });
        }

        const patients = await Patient.find({ physicianEmail: physician.email });
        return res.status(200).json({ patients: patients });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'An unexpected error occurred on the server while processing your request. Please try again later.' });
    }
});




module.exports = router;
