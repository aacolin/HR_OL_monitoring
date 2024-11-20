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

// set up error handling
app.use(function(err, req, res, ne***REMOVED***t) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// catch 404 and forward to error handler
app.use(function(req, res, ne***REMOVED***t) {
  ne***REMOVED***t(httpError(404));
});

module.e***REMOVED***ports = app;
