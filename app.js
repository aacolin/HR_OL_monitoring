// Load environment variables
require('dotenv').config();
const bodyParser = require('body-parser');

var e***REMOVED***press = require('e***REMOVED***press');
var path = require('path');
var httpError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');

var app = e***REMOVED***press();
var sensorRouter = require('./routes/sensor');

// Middleware setup
app.use(logger('dev'));     // Show HTTP requests in the console
app.use(e***REMOVED***press.json());    // Parse JSON bodies
// app.use(e***REMOVED***press.urlencoded({ e***REMOVED***tended: false }));   // Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ e***REMOVED***tended: false }));
app.use(cookieParser());    // Parse cookie headers
app.use(e***REMOVED***press.static(path.join(__dirname, 'public')));    // Serve static files
app.use(function (req, res, ne***REMOVED***t) {   // Set up CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  ne***REMOVED***t();
});

// Serve the favicon
app.use(favicon(path.join(__dirname, 'public','assets', 'img', 'favicon.png')));

// set up routes
var inde***REMOVED***Router = require('./routes/inde***REMOVED***');
var patientsRouter = require('./routes/patients');
var physiciansRouter = require('./routes/physicians');
var devicesRouter = require('./routes/devices');

// Routes
app.use('/', inde***REMOVED***Router);
app.use('/patients', patientsRouter);
app.use('/physicians', physiciansRouter);
app.use('/devices', devicesRouter);
app.use('/sensor', sensorRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// catch 404 and forward to error handler
app.use(function(req, res, ne***REMOVED***t) {
  const err = new Error('404 Page Not Found');
  err.status = 404;
  ne***REMOVED***t(err);
});

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





  //res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  //res.status(err.status || 500).json({ message: msgStr, err: err });
  res.status(err.status || 500).json(msgStr);
  //res.render('error');
  });
  console.log('Received data 404:', req.body);
});

module.e***REMOVED***ports = app;
