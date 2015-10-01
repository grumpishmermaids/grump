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

    utils.queryServer(grump, function(err, res) {
      if (err) {
        if (err.code === "ENOTFOUND") {
          console.log("Error".red + ": Unable to contact grump servers. Are you online?");
        } else {
          console.log(err);
        }
      } else {

        // Multiple grumps found
        if (res.grumps.length > 1) {
          console.log("Found multiple grumps named " + grump.cyan + ".");
          console.log("Please choose a specific grump from the list below and rerun your command.\n");

          res.grumps.forEach(function(grump) {
            console.log("\t" + grump.owner.login.green + "/" + grump.command.cyan);
          });

          console.log("\n");

        // Only 1 grump found, ready to install/run
        } else if (res.grumps.length === 1) {
          // install it
          utils.install(res.grumps[0], function() {

            // and then pass in the args and run it
            utils.run(grump, args.slice(1));
          });

        // No grumps found
        } else {
          console.log("Error".red + ": Grump " + grump.cyan + " was not found on the server.");
        }
      }
    });

  // Or else just run the grump
  } else {
    utils.run(grump, args.slice(1));
  }
};
