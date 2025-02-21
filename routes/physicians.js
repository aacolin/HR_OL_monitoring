const express = require('express');
const router = express.Router();
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const secret = fs.readFileSync(__dirname + '/../jwt/secret').toString();
const Physician = require('../models/physician');
const Patient = require('../models/patient'); // Add this line to import the Patient model

const PhysicianExists = 'A physician with this email address already exists. Please use a different email address.';
const InvalidData = 'Your request contains invalid data or missing fields. Please correct and try again.'
const ServerError = 'An unexpected error occurred on the server while processing your request please try again later.'
const PhysicianCreated = 'Physician account created successfully.';
const InvalidUserNameOrPassword = 'Invalid username or password.';
const PhysicianNotFound = 'Email not found.';
const AllFieldsRequired = 'All fields are required: First Name, Last Name, email, password'



router.post('/signup', async function(req, res) {
    try {    
        const signUpFormData = req.body;
        const requiredFields = ['FirstName', 'LastName', 'Specialty', 'Email', 'Password'];
        
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
    
        const newPhysician = new Physician();
        const hashedPassword = await bcrypt.hash(password, 10);
        Object.assign(newPhysician, {
            firstName: signUpFormData.FirstName,
            lastName: signUpFormData.LastName,
            specialty: signUpFormData.Specialty,
            email: signUpFormData.Email,
            password: hashedPassword
        });

        const physicianExist = await Physician.findOne({ email: signUpFormData.Email });
        if (physicianExist) {
            throw new Error(PhysicianExists);
        } else {
            await newPhysician.save();
            const tokenPayload = { Email: signUpFormData.Email };
            const encodedToken = jwt.encode(tokenPayload, secret);
            return res
                .status(201)
                .json({ message: PhysicianCreated, physicianToken: encodedToken });
        }
    } catch (err) {
        if (err.message === InvalidData) {
            return res
                .status(400)
                .json({ message: InvalidData });
        }
        if (err.message === PhysicianExists) {
            return res
                .status(409)
                .json({ message: PhysicianExists });
        } else {
            console.log(err);
            return res
                .status(500)
                .json({ message: ServerError });
        }
    }
});


router.get('/token-auth', async function(req, res) {
    
    // check if X-Auth-Token header is present
    if (!req.headers['x-auth']) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try{
        const receivedToken = req.headers['x-auth'];
        const tokenDecoded = jwt.decode(receivedToken, secret);
        const physicianExist = await Physician.findOne({ email: tokenDecoded.email });
        if (!physicianExist) {
            throw new Error('Physician not found');
        }
        else{
            return res.status(200).json({ success: true , message: 'Physician found' });
        }
    }
    catch(err){
        console.log("Error at token auth" + err);
        return res.status(401).json({ message: 'Invalid JWT' });
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
      
        //check if the Physician exists in the database
        const existingPhysician = await Physician.findOne({ email: userEmail });
        if (!existingPhysician) {
            throw new Error(PhysicianNotFound);
        }
        
        const isCorrectPassword = await bcrypt.compare(userPassword,existingPhysician.password);
        if (!isCorrectPassword) {
            throw new Error(InvalidUserNameOrPassword);
        }

        if (existingPhysician && isCorrectPassword) {
            var payload = { email: existingPhysician.email };
            let encodedToken = jwt.encode(payload, secret);
            return res.status(200).json({ physicianToken: encodedToken});
        }
    }catch(err){
        if (err.message === InvalidUserNameOrPassword) {
            return res
                .status(400)
                .json({ message: InvalidUserNameOrPassword });
        }
        if (err.message === PhysicianNotFound) {
            return res
                .status(400)
                .json({ message: PhysicianNotFound });
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
    // console.log("tokenDecoded: " + tokenDecoded.email);

    const physicianInDatabase = await Physician.findOne({ email: tokenDecoded.email });

    if (!physicianInDatabase) {
        return res.status(404).json({ message: 'Physician not found' });
    }
    else {
        const physicianProfile = {
            firstName: physicianInDatabase.firstName,
            lastName: physicianInDatabase.lastName,
            specialty: physicianInDatabase.specialty,
            email: physicianInDatabase.email
        };
        return res.status(200).json({ message: 'Physician found', profile: physicianProfile });
    }


});


router.put('/profile', async function(req, res) {
    const { token, firstName, lastName } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token not found' });
    }

    const tokenDecoded = jwt.decode(token, secret);
    const physician = await Physician.findOne({ email: tokenDecoded.email });

    if (!physician) {
        return res.status(404).json({ message: 'Physician not found' });
    }

    if (!firstName || !lastName) {
        return res.status(400).json({ message: 'First Name and Last Name are required' });
    }

    physician.firstName = firstName;
    physician.lastName = lastName;

    try {
        await physician.save();
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
    const physician = await Physician.findOne({ email: tokenDecoded.email });

    if (!physician) {
        return res.status(404).json({ message: 'Physician not found' });
    }

    const isCorrectPassword = await bcrypt.compare(currentPassword, physician.password);
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
    physician.password = hashedNewPassword;

    try {
        await physician.save();
        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: ServerError });
    }
});

router.post('/physician-info', async function(req, res) {
    const { token } = req.body;
    // console.log('token at physician-info: ', token);

    try {
        if (token === '' || token === null) {
            // create a dummy physician profile to send back
            const physicianProfile = {
                firstName: '',
                lastName: '',
                email: ''
            }
            return res.status(200).json({ physicianProfile: physicianProfile, message: 'No Physician Assigned' });
        }
        const physicianProfile = await Physician.findOne( { email: token} );
        
        if (!physicianProfile) {
            return res.status(404).json({ message: 'Physician not found' });
        }
        return res.status(200).json({ physicianProfile: physicianProfile, message: 'Physician found' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: ServerError });
    }
});

router.post('/physicians-list', async function(req, res) {
    const { token } = req.body;

    try {
        const decodedToken = jwt.decode(token, secret);
        // console.log('decoded token at physician list: ', decodedToken); 
        const patient = await Patient.findOne( { email: decodedToken.email} );
        if (!patient) {
            return res.status(404).json({ message: 'User not found' });
        }

        const physiciansList = await Physician.find({}, 'firstName lastName email');
        return res.status(200).json({ physiciansList });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: ServerError });
    }
});




module.exports = router;
