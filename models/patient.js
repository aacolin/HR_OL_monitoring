const db = require("../javascript/mongodb");

const patientSchema = new db.Schema({
    firstName:      { type: String, default: '' },
    lastName:       { type: String, default: '' },
    email:          { type: String, default: '' },
    physicianEmail: { type: String, default: '' },
    password:       { type: String, default: '' },
    lastAccess:     { type: Date, default: Date.now },
 });

 const Patient = db.model("Patient", patientSchema);

module.e***REMOVED***ports = Patient;