var path  = require('path');
var fs    = require('fs');
var utils = require('../utils.js');

module.exports = function(args) {
  var config = utils.config;

  if (args.length === 0) {
    console.log(config);
  } else if (args.length === 1) {
    console.log(config[args[0]]);
  } else {
    config[args[0]] = args[1];
    utils.updateConfig(config);
    console.log("{" + args[0] + ": " + args[1] + "}");
  }
};
