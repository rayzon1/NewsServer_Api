var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    version: "1.0.0",
    message: "Welcome to my newsApi node server"
  });
});

module.exports = router;
