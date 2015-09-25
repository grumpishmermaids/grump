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
  console.log("1");
  utils.gitGet(repo, function(info){
    

    //bundle git response + frontend data
    info.runFile = req.body.runFile;
    info.command = req.body.command;
    console.log("2");
    console.log(info);

    // post to mongo
    var pack = new Package(info);
    console.log("3");
    pack.save(function (err) {
      console.log("4");
      if (err) { 
        console.log("5ERROR");
        //res.sendStatus(500);
        console.dir(err);
      } else {
        console.log("6 WIN");
        res.sendStatus(200);
      }
    });
  });
});

module.exports = router;
