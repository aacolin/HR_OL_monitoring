var express = require('express');
var router = express.Router();

/* redirect to home page. */
router.get('/', function(req, res, next) {
  res.send('Hello, client! You have connected to the server.');
  res.redirect('/.html');
 // res.redirect('./plot-sensor-data.html');
});

module.exports = router;