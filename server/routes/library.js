var express   = require('express');
var path      = require('path');
var config    = require('../config.json');
var router    = express.Router();
var Package   = require('../models/Package');

// Get all them grumps
router.get('/', function(req, res, next) {
  var grump = req.params.grump;
  
  //instead we need to query mongo
  Package.find({},function (err, result) {
    if(err) console.log(err);
    res.send(result);
  });

});

// Search for a specific grump in our DB
router.get('/:grump?', function(req, res, next) {
  var grump = req.params.grump;
  
  //instead we need to query mongo
  Package.findOne({command:grump}, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  });

});





module.exports = router;
