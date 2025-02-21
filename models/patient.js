const db = require("../javascript/mongodb");

const patientSchema = new db.Schema({
    firstName:      { type: String, default: '' },
    lastName:       { type: String, default: '' },
    email:          { type: String, default: '' },
    physicianEmail: { type: String, default: '' },
    password:       { type: String, default: '' },
    devices:        { type: Array, default: [] },
    lastAccess:     { type: Date, default: Date.now },
    events: [{
    eventName: { type: String, default: '' },
    published_at: { type: Date, required: true },
    sampledTime: { type: Date, required: true },
    eventDescription: { type: String, default: '' },
    eventPublishedTime: { type: String, default: '' },
    eventPublishedDate: { type: String, default: '' },
    heartRate: { type: Number, default: 0 },
    SpO2: { type: Number, default: 0 },
    }],
});



 const Patient = db.model("Patient", patientSchema);

module.exports = Patient;
