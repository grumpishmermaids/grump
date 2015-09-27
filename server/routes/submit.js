var express   = require('express');
var path      = require('path');

var request   = require('request');
var url       = require('url');
var router    = express.Router();
var utils     = require('../helpers/route-utils');
var Package   = require('../models/Package');

// Submitting a package into Grump Library
router.post('/', function(req, res, next) {
  var repo = url.parse(req.body.repo).path.slice(1).split('/');
  utils.gitGet(repo, function(info){
    

    //bundle git response + frontend data
    info.runFile = req.body.runFile;
    info.command = req.body.command;

    // post to mongo
    var pack = new Package(info);
    pack.save(function (err) {
      if (err) { 
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  });
});

module.exports = router;
