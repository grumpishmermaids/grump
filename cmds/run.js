var path  = require('path');
var fs    = require('fs');
var color = require('colors');
var utils = require('../utils.js');

module.exports = function(args) {
  var grump = args[0];

  // Make sure we are receiving a grump to run
  if (args.length === 0) {
    console.log("Error".red + ": Please provide a grump to run.");
    return;
  }

  if (utils.isVerbose()) {
    console.log("Received grump: " + grump.cyan);
  }

  // Check if the grump is installed locally
  if (!utils.validLocalGrump(grump)) {
    if (utils.isVerbose()) {
      console.log("Error".red + ": grump " + grump.cyan + " was not found locally...querying server...");
    }

    utils.queryServer(grump);
    // If it isn't query the server
  }
};
