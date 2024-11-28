var e***REMOVED***press = require('e***REMOVED***press');
var router = e***REMOVED***press.Router();

/* redirect to home page. */
router.get('/', function(req, res, ne***REMOVED***t) {
  res.send('Hello, client! You have connected to the server.');
 // res.redirect('/.html');
  res.redirect('./plot-sensor-data.html');
});

module.e***REMOVED***ports = router;