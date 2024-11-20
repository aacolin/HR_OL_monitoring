const db = require("../javascript/mongodb");

const accessTokenSchema = new db.Schema({
    name: String,
    value: String,
    e***REMOVED***pirationDate: Date
});

const accessToken = db.model('AccessToken', accessTokenSchema, 'accessTokens');

module.e***REMOVED***ports = accessToken;
