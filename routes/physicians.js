const e***REMOVED***press = require('e***REMOVED***press');
const router = e***REMOVED***press.Router();
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const secret = fs.readFileSync(__dirname + '/../jwt/secret').toString();
const Physician = require('../models/physician');

const PhysicianE***REMOVED***ists = 'A physician with this email address already e***REMOVED***ists. Please use a different email address.';
const InvalidData = 'Your request contains invalid data or missing fields. Please correct and try again.'
const ServerError = 'An une***REMOVED***pected error occurred on the server while processing your request please try again later.'
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
        const emailRege***REMOVED*** = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
        if (!emailRege***REMOVED***.test(signUpFormData.Email)) {
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

        const physicianE***REMOVED***ist = await Physician.findOne({ email: signUpFormData.Email });
        if (physicianE***REMOVED***ist) {
            throw new Error(PhysicianE***REMOVED***ists);
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
        if (err.message === PhysicianE***REMOVED***ists) {
            return res
                .status(409)
                .json({ message: PhysicianE***REMOVED***ists });
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
    if (!req.headers['***REMOVED***-auth']) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const receivedToken = req.headers['***REMOVED***-auth'];
    const tokenDecoded = jwt.decode(receivedToken, secret);
    
    try{
        const physicianE***REMOVED***ist = await Physician.findOne({ email: tokenDecoded.email });
        if (!physicianE***REMOVED***ist) {
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
        console.log("login request received");
        const userEmail = req.body.Email;
        const userPassword = req.body.Password;
        
        // check if the email and password are not empty
        if (!userEmail || !userPassword) {
            throw new Error(InvalidUserNameOrPassword);
        }
      
        //check if the Physician e***REMOVED***ists in the database
        const e***REMOVED***istingPhysician = await Physician.findOne({ email: userEmail });
        if (!e***REMOVED***istingPhysician) {
            throw new Error(PhysicianNotFound);
        }
        
        const isCorrectPassword = await bcrypt.compare(userPassword,e***REMOVED***istingPhysician.password);
        if (!isCorrectPassword) {
            throw new Error(InvalidUserNameOrPassword);
        }

        if (e***REMOVED***istingPhysician && isCorrectPassword) {
            // console.log("e***REMOVED***isting Physician: " + e***REMOVED***istingPhysician);
            var payload = { email: e***REMOVED***istingPhysician.email };
            let encodedToken = jwt.encode(payload, secret);
            // console.log("encoded token: " + encodedToken);
            return res.status(200).json({ success: true, PhysicianToken: encodedToken});
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
module.e***REMOVED***ports = router;
