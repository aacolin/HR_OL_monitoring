// Load environment variables
require('dotenv').config();
const bodyParser = require('body-parser');

var express = require('express');
var path = require('path');
var httpError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');

var app = express();
var sensorRouter = require('./routes/sensor');

// Middleware setup
app.use(logger('dev'));     // Show HTTP requests in the console
app.use(express.json());    // Parse JSON bodies
// app.use(express.urlencoded({ extended: false }));   // Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());    // Parse cookie headers
app.use(express.static(path.join(__dirname, 'public')));    // Serve static files
app.use(function (req, res, next) {   // Set up CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Serve the favicon
app.use(favicon(path.join(__dirname, 'public','assets', 'img', 'favicon.png')));

// set up routes
var indexRouter = require('./routes/index');
var patientsRouter = require('./routes/patients');
var physiciansRouter = require('./routes/physicians');
var devicesRouter = require('./routes/devices');

// Routes
app.use('/', indexRouter);
app.use('/patients', patientsRouter);
app.use('/physicians', physiciansRouter);
app.use('/devices', devicesRouter);
app.use('/sensor', sensorRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('404 Page Not Found');
  err.status = 404;
  next(err);
});

// set up error handling
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
