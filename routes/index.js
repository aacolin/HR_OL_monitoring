var e***REMOVED***press = require('e***REMOVED***press');
var router = e***REMOVED***press.Router();

/* redirect to home page. */
router.get('/', function(req, res, ne***REMOVED***t) {
  res.redirect('/home.html');
});

module.e***REMOVED***ports = router;