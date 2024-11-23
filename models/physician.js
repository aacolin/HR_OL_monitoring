const db = require("../javascript/mongodb");

const physicianSchema = new db.Schema({
    firstName:      { type: String, default: '' },
    lastName:       { type: String, default: '' },
    specialty:      { type: String, default: '' },
    email:          { type: String, default: '' },
    password:       { type: String, default: '' },
    lastAccess:     { type: Date, default: Date.now },
 });

 const Physician = db.model("Physician", physicianSchema);

module.e***REMOVED***ports = Physician;