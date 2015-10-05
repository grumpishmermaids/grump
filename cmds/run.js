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

    // Query server for grumps
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
          console.log("Found multiple remote grumps named " + grump.cyan + ".");
          console.log("Please choose a specific grump from the list below and rerun your command.\n");

          res.grumps.forEach(function(grump) {
            console.log("\t" + grump.author.green + "/" + grump.defaultCommand.cyan);
          });

          console.log("\n");

        // Only 1 grump found, ready to install/run
        } else if (res.grumps.length === 1) {
          // install it
          utils.install(res.grumps[0], function() {

            // and then pass in the args and run it
            var chosen = res.grumps[0];
            utils.run(chosen.author + "/" + chosen.defaultCommand, args.slice(1));
          });

        // No grumps found
        } else {
          console.log("Error".red + ": Grump " + grump.cyan + " was not found on the server.");
        }
      }
    });

  // Or else just run the grump
  } else {
    var installedGrumps = utils.getInstalledGrumps();

    // Specific grump.
    if (grump.indexOf("/") !== -1) {
      utils.run(grump, args.slice(1));

    // General
    } else {
      // If more than one local grump installed with same name
      if (installedGrumps[2][grump].length > 1) {
        console.log("Found multiple local grumps named " + grump.cyan + ".");
        console.log("Please choose a specific grump from the list below and rerun your command.\n");

        installedGrumps[2][grump].forEach(function(grump) {
          console.log("\t" + grump[0].green + "/" + grump[1].cyan);
        });

        console.log("\n");

      // Since only 1 local grump exists, assume that is the one the user wanted.
      } else {
        var chosen = installedGrumps[2][grump][0];
        utils.run(chosen[0] + "/" + chosen[1], args.slice(1));
      }
    }
  }
};
