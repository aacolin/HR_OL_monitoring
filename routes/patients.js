var e***REMOVED***press = require('e***REMOVED***press');
var router = e***REMOVED***press.Router();
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const secret = fs.readFileSync(__dirname + '/../jwt/secret').toString();
const Patient = require('../models/patient');

const PatientE***REMOVED***ists = 'A patient with this email address already e***REMOVED***ists. Please use a different email address.';
const InvalidData = 'Your request contains invalid data or missing fields. Please correct and try again.'
const ServerError = 'An une***REMOVED***pected error occurred on the server while processing your request please try again later.'
const PatientCreated = 'Patient account created successfully.';
const InvalidUserNameOrPassword = 'Invalid username or password.';

router.post('/signup', async function(req, res) {
    
    try {    
        const signUpFormData = req.body;
        if (!req.body.FirstName || !req.body.LastName || !req.body.Email || !req.body.Password) {
            throw new Error(InvalidData);
        }

        const newPatient = new Patient();
        const hashedPassword = await bcrypt.hash(signUpFormData.Password, 10);
        Object.assign(newPatient, {
            firstName: signUpFormData.FirstName,
            lastName: signUpFormData.LastName,
            email: signUpFormData.Email,
            password: hashedPassword
        });

        const patientE***REMOVED***ist = await Patient.findOne({ email: signUpFormData.Email });
        if (patientE***REMOVED***ist) {
            throw new Error(PatientE***REMOVED***ists);
        }
        else {
            await newPatient.save();
            const token = jwt.encode({ patientEmail: signUpFormData.Email }, secret);
            return res
                .status(201)
                .json({ message: PatientCreated, patientToken: token });
        }
    } catch (err) {
        if (err.message === InvalidData) {
            return res
                .status(400)
                .json({ message: InvalidData });
        }
        if (err.message === PatientE***REMOVED***ists) {
            return res
                .status(409)
                .json({ message: PatientE***REMOVED***ists });
        }
        else {
            return res
                .status(500)
                .json({ message: ServerError });
        }
    }
});


const PatientNotFound = 'Patient not found please create an account.';

router.post('/login', async function(req, res) {

    try{
        
        const userEmail = req.body.Email;
        const userPassword = req.body.Password;
        
        // check if the email and password are not empty
        if (!userEmail || !userPassword) {
            throw new Error(InvalidUserNameOrPassword);
        }
      
        //check if the patient e***REMOVED***ists in the database
        const e***REMOVED***istingPatient = await Patient.findOne({ email: userEmail });
        if (!e***REMOVED***istingPatient) {
            throw new Error(PatientNotFound);
        }
        
        const isCorrectPassword = await bcrypt.compare(userPassword,e***REMOVED***istingPatient.password);
        if (!isCorrectPassword) {
            throw new Error(InvalidUserNameOrPassword);
        }

        if (e***REMOVED***istingPatient && isCorrectPassword) {
            const token = jwt.encode({ userEmail: e***REMOVED***istingPatient.email }, secret);
            await e***REMOVED***istingPatient.save();
            res.status(200).json({ success: true, patientToken: token, message: "Login success" });
        }
    }catch(err){
        if (err.message === InvalidUserNameOrPassword) {
            console.log(err.message);
            return res
                .status(400)
                .json({ message: InvalidUserNameOrPassword });
        }
        if (err.message === PatientNotFound) {
            console.log(err.message);
            return res
                .status(400)
                .json({ message: PatientNotFound });
        }
        // else {
        //     console.log(err.message);
        //     return res
        //         .status(500)
        //         .json({ message: ServerError });
        // }
    }

});

module.e***REMOVED***ports = router;
