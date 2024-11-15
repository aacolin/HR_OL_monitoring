require('dotenv').config();
var createError = require('http-errors');
var e***REMOVED***press = require('e***REMOVED***press');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = e***REMOVED***press();

app.use(logger('dev'));
app.use(e***REMOVED***press.json());
app.use(e***REMOVED***press.urlencoded({ e***REMOVED***tended: false }));
app.use(cookieParser());
app.use(e***REMOVED***press.static(path.join(__dirname, 'public')));

var inde***REMOVED***Router = require('./routes/inde***REMOVED***');
// var patientsRouter = require('./routes/patients');
// var sensorDataRouter = require('./routes/sensorData'); 
// var devicesRouter = require('./routes/devices');
// var physiciansRouter = require('./routes/physicians');

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// CORS middleware
app.use(function (req, res, ne***REMOVED***t) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  ne***REMOVED***t();
});

// Routes
app.use('/', inde***REMOVED***Router);
// app.use('/patients', patientsRouter);
// app.use('/sensorData', sensorDataRouter); 
// app.use('/devices', devicesRouter);
// app.use('/physicians', physiciansRouter);

// catch 404 and forward to error handler
app.use(function(req, res, ne***REMOVED***t) {
  ne***REMOVED***t(createError(404));
});

// error handler
app.use(function(err, req, res, ne***REMOVED***t) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.e***REMOVED***ports = app;
