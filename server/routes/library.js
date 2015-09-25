var express   = require('express');
var path      = require('path');
var config    = require('../config.json');
var router    = express.Router();
var Package   = require('../models/Package');

// Search for a specific package in our DB
router.get('/:grump?', function(req, res, next) {
  var grump = req.params.grump;
  
  //instead we need to query mongo
  Package.findOne({command:grump}, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  });

});

module.exports = router;
