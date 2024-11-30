const e***REMOVED***press = require('e***REMOVED***press');
const router = e***REMOVED***press.Router();
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const secret = fs.readFileSync(__dirname + '/../jwt/secret').toString();
const Patient = require('../models/patient');
const dotenv = require('dotenv');
dotenv.config();
const a***REMOVED***ios = require('a***REMOVED***ios');
const request = require('request');
const qs = require('qs');

// fetch PARTICLE_ACCESS_TOKEN
var particleAccessToken = process.env.PARTICLE_ACCESS_TOKEN;
var particleUserName = process.env.PARTICLE_USERNAME;
var particlePassword = process.env.PARTICLE_PASSWORD;
var particleClientId = process.env.PARTICLE_CLIENT_ID;
var particleClientSecret = process.env.PARTICLE_CLIENT_SECRET;

// Function to verify the Particle access token
async function verifyParticleAccessToken() {
    try {
        await a***REMOVED***ios.get('https://api.particle.io/v1/devices', {
            headers: {
                'Authorization': `Bearer ${particleAccessToken}`
            }
        });
        
        return particleAccessToken;
    } catch (error) {
        if (error.response.status === 401) {
            console.log('Particle cloud. Invalid or e***REMOVED***pired token : ' + error);
            console.log('Requesting new token');
            return await requestNewParticleToken();
        } else {
            throw new Error('Error verifying Particle access token');
        }
    }
}

// Function to request a new Particle access token
async function requestNewParticleToken() {
    try {
        // Request a new access token from the Particle Cloud API
        const response = await a***REMOVED***ios.post('https://api.particle.io/oauth/token', qs.stringify({
            grant_type: 'password',
            username: particleUserName,
            password: particlePassword,
            client_id: particleClientId,
            client_secret: particleClientSecret
        }));

        const newToken = response.data.access_token;
        updateEnvFile('PARTICLE_ACCESS_TOKEN', newToken);
        particleAccessToken = newToken;
        return newToken;
    } catch (error) {
        console.log('Error requesting new Particle access token: ' + error);
        throw new Error('Error requesting new Particle access token');
    }
}

// Function to update the .env file
function updateEnvFile(key, value) {
    const envFilePath = __dirname + '/../.env';
    const envFileContent = fs.readFileSync(envFilePath, 'utf8');
    const newEnvFileContent = envFileContent.replace(new RegE***REMOVED***p(`${key}=.*`), `${key}=${value}`);
    fs.writeFileSync(envFilePath, newEnvFileContent);
}

// Function to get patient by email
async function getPatientByEmail(email) {
    return await Patient.findOne({ email });
}

// Function to get device info from Particle Cloud
function getDeviceInfoFromParticle(deviceId, token) {
    return new Promise((resolve, reject) => {
        request({
            url: `https://api.particle.io/v1/devices/${deviceId}`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(JSON.parse(body));
            } else {
                reject({ statusCode: response.statusCode, body: JSON.parse(body) });
            }
        });
    });
}

// Route handler for device info
router.post('/device-info', async function(req, res) {
    const { token } = req.body;
    const tokenDecoded = jwt.decode(token, secret);
    const patientEmail = tokenDecoded.email;

    if (!patientEmail) {
        return res.status(400).json({ message: 'Invalid token' });
    }

    try {
        const patient = await getPatientByEmail(patientEmail);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const deviceId = patient.devices[0];
        if (!deviceId) {
            return res.status(404).json({ message: 'Device not found, please add a device' });
        }

        verifyParticleAccessToken()
            .then(validToken => getDeviceInfoFromParticle(deviceId, validToken))
            .then(deviceInfo => res.json(deviceInfo))
            .catch(err => {
                if (err.statusCode) {
                    res.status(err.statusCode).json(err.body);
                } else {
                    res.status(500).json({ message: 'Server error' });
                }
            });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});

module.e***REMOVED***ports = router;
