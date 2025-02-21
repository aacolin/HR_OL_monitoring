const db = require('../db');

const sensorDataSchema = new db.Schema({
    deviceId: String,
    dataReadings: {heartrate: Number, ocigenSaturation: Number},
    publishedDate: Date, 
    measurementDate: Date
});

const sensor = db.model('sensor', sensorSchema, 'data');

module.exports = sensorData;