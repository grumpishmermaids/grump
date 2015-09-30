var path  = require('path');
var fs    = require('fs');
var utils = require('../utils.js');

module.exports = function(args) {
  var grump = args[0];
  console.log("Received grump: " + grump);

  // Check if the grump is installed
  if (!utils.validCommand(grump)) {
    console.log("Error".red + ": grump " + grump.green + " was not found. Are you sure it is installed?");
  }
};
