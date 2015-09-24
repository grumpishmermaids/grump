var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/lib/:package?', function(req, res, next) {
  var package = req.params.package;
  res.download(path.join(__dirname, "/../uploads/" + package + ".sh"), package + ".sh");
});

module.exports = router;
