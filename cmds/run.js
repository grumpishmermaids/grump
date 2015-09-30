var path  = require('path');
var fs    = require('fs');
var color = require('colors');
var utils = require('../utils.js');

module.exports = function(args) {

  // Make sure we are receiving a grump to run
  if (args.length === 0) {
    console.log("Error".red + ": Please provide a package to run.");
    return;
  }
  var grump = args[0];

  if (utils.config.verbose !== "false") {
    console.log("Received grump: " + grump.cyan);
  }

  // Check if the grump is installed locally
  if (!utils.validLocalGrump(grump)) {
    console.log("Error".red + ": grump " + grump.cyan + " was not found locally...querying server...");
  }
};
