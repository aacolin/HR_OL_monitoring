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

// set up middlewares
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

app.use('/', inde***REMOVED***Router);
app.use('/patients', patientsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, ne***REMOVED***t) {
  ne***REMOVED***t(httpError(404));
});

// set up error handling
app.use(function(err, req, res, ne***REMOVED***t) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.e***REMOVED***ports = app;
