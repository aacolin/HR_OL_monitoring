const express = require('express');
const router = express.Router();
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const secret = fs.readFileSync(__dirname + '/../jwt/secret').toString();
const Patient = require('../models/patient');
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const request = require('request');
const qs = require('qs');

// fetch PARTICLE_ACCESS_TOKEN
var particleAccessToken = process.env.PARTICLE_ACCESS_TOKEN;
var particleUserName = process.env.PARTICLE_USERNAME;
var particlePassword = process.env.PARTICLE_PASSWORD;
var particleClientId = process.env.PARTICLE_CLIENT_ID;
var particleClientSecret =  process.env.PARTICLE_CLIENT_SECRET;

// Function to verify the Particle access token
async function verifyParticleAccessToken() {
    try {
        await axios.get('https://api.particle.io/v1/devices', {
            headers: {
                'Authorization': `Bearer ${particleAccessToken}`
            }
        });
        
        return particleAccessToken;
    } catch (error) {
        if (error.response.status === 401) {
            console.log('Particle cloud. Invalid or expired token : ' + error);
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
        const response = await axios.post('https://api.particle.io/oauth/token', qs.stringify({
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
    const newEnvFileContent = envFileContent.replace(new RegExp(`${key}=.*`), `${key}=${value}`);
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


router.post('/add-device', async function(req, res) {
    const { token, deviceId } = req.body;
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

        // Check if the deviceId already exists in the patient's devices list
        if (patient.devices.includes(deviceId)) {
            return res.status(400).json({ message: 'Device already added' });
        }
        
        // validate the device id with Particle Cloud
        verifyParticleAccessToken()
            .then(validToken => getDeviceInfoFromParticle(deviceId, validToken))
            .then(async deviceInfo => {
                patient.devices.push(deviceId);
                await patient.save();
                res.json({ message: 'Device added successfully', deviceInfo });
            })
            .catch(err => {
                console.log('Error adding device:' + err.statusCode);
                if (err.statusCode === 403) {
                    res.status(403).json({ message: 'Invalid Device Id' });
                } else if (err.statusCode) {
                    res.status(err.statusCode).json(err.body);
                } else {
                    res.status(500).json({ message: 'Server error' });
                }
            });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});




module.exports = router;
