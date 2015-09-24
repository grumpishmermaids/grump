var express   = require('express');
var path      = require('path');
var config    = require('../config.json');
var router    = express.Router();

// Search for a specific package in our DB
router.get('/:package?', function(req, res, next) {
  var package = req.params.package;
  res.download(path.join(__dirname, "../uploads/" + package + ".sh"), package + ".sh");
});

module.exports = router;
