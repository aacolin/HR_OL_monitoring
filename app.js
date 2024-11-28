// Load environment variables
require('dotenv').config();

var e***REMOVED***press = require('e***REMOVED***press');
var path = require('path');
var httpError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = e***REMOVED***press();

var inde***REMOVED***Router = require('./routes/inde***REMOVED***');
var patientsRouter = require('./routes/patients');
var sensorRouter = require('./routes/sensor');

// set up middlewares
app.use(logger('dev'));     // Show HTTP requests in the console
app.use(e***REMOVED***press.json());    // Parse JSON bodies
app.use(e***REMOVED***press.urlencoded({ e***REMOVED***tended: false }));   // Parse URL-encoded bodies
app.use(cookieParser());    // Parse cookie headers
app.use(e***REMOVED***press.static(path.join(__dirname, 'public')));    // Serve static files
app.use(function (req, res, ne***REMOVED***t) {   // Set up CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  ne***REMOVED***t();
});

// set up routes
app.use('/', inde***REMOVED***Router);
app.use('/patients', patientsRouter);
app.use('/sensor', sensorRouter);

// app.post('/sensor/data', (req, res) => {
//   res.status(201).json({ message: 'Received POST request!' });
//   //res.send('Received POST request!');
// });

// set up error handling
app.use(function(err, req, res, ne***REMOVED***t) {
  console.log('Received data app.js :', req.body);
  console.log('Received data app.js :', req.header);

   // You can also log specific headers, for e***REMOVED***ample:
   console.log('Content-Type:', req.get('Content-Type'));
   console.log('Host:', req.get('Host'));
   console.log('Content-Length:', req.get('Content-Length'));

   // Send a response
   //res.status(200).send('Headers received');





  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  //res.status(err.status || 500);
  //res.status(500);
  //res.send('500 - Internal server error, something une***REMOVED***oecded happedned in web server');
  let msgStr = `Something wrong....`;
  //res.status(err.status || 500).json({ message: msgStr, err: err });
  res.status(err.status || 500).json(msgStr);
  //res.render('error');
});

// catch 404 and forward to error handler
app.use(function(req, res, ne***REMOVED***t) {
  console.log('Received data 404:', req.body);
  ne***REMOVED***t(httpError(404));
});

module.e***REMOVED***ports = app;
