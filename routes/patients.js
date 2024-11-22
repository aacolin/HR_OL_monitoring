const e***REMOVED***press = require('e***REMOVED***press');
const router = e***REMOVED***press.Router();
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
const PatientNotFound = 'Email not found.';
const AllFieldsRequired = 'All fields are required: First Name, Last Name, email, password'



router.get('/token-auth', async function(req, res) {
    
    // check if X-Auth-Token header is present
    if (!req.headers['***REMOVED***-auth']) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const receivedToken = req.headers['***REMOVED***-auth'];
    const tokenDecoded = jwt.decode(receivedToken, secret);
    
    try{
        const patientE***REMOVED***ist = await Patient.findOne({ email: tokenDecoded.email });
        if (!patientE***REMOVED***ist) {
            throw new Error('Patient not found');
        }
        else{
            return res.status(200).json({ status: 200, message: 'Patient found' });
        }
    }
    catch(err){
        console.log("Error at token auth" + err);
        res.status(401).json({ message: 'Invalid JWT' });
    }
});


router.post('/signup', async function(req, res) {
    
    try {    
        const signUpFormData = req.body;

        // Validate the request body
        if (!signUpFormData.FirstName || !signUpFormData.LastName || !signUpFormData.Email || !signUpFormData.Password) {
          return res.status(400).json({ message: AllFieldsRequired });
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
            const tokenPayload = { Email: signUpFormData.Email };
            const token = jwt.encode(tokenPayload, secret);
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
            console.log(err)
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
            var payload = { email: e***REMOVED***istingPatient.email };
            const token = jwt.encode(payload, secret);
            await e***REMOVED***istingPatient.save();
            res.status(200).json({ success: true, patientToken: token, message: "Login success" });
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
        }
        else {
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
    const tokenDecoded = jwt.decode(token, secret);
    // console.log("tokenDecoded: " + tokenDecoded.email);

    const patienInDatabase = await Patient.findOne({ email: tokenDecoded.email });

    if (!patienInDatabase) {
        return res.status(404).json({ message: 'Patient not found' });
    }
    else {
        const patientProfile = {
            firstName: patienInDatabase.firstName,
            lastName: patienInDatabase.lastName,
            email: patienInDatabase.email
        };
        return res.status(200).json({ message: 'Patient found', profile: patientProfile });
    }


});
    
module.e***REMOVED***ports = router;
