// connects to the local MongoDB instance
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/saguaro_hrm')
.then(() => {
  console.log('Connected to the local MongoDB instance.');
})
.catch((err) => {
  console.error('Error connecting to the local MongoDB instance:', err);
});
module.exports = mongoose;