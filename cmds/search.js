var path  = require('path');
var fs    = require('fs');
var color = require('colors');
var utils = require('../utils.js');

module.exports = function(args) {
  var search = args[0];

  // Make sure we are receiving a grump to run
  if (args.length === 0) {
    console.log("Error".red + ": Please provide a search term (grump or author).");
    return;
  }
  if (utils.isVerbose()) {
    console.log("Searching for '%s' on server..." + search.cyan);
  }

  // Query server for grumps
  utils.queryServer(search, function(err, res) {
    if (err) {
      if (err.code === "ENOTFOUND") {
        console.log("Error".red + ": Unable to contact grump servers. Are you online?");
      } else {
        console.log(err);
      }
    } else {
      // Found author matching search: display their grumps
      if (res.user.length > 0) {
        console.log("\nFound: author");
        res.user.forEach(function (grump) {
          console.log("\t" + grump.author.green + "/" + grump.defaultCommand.cyan);
        });
        console.log("");
      }

      // Found grumps matching search: display
      if (res.grumps.length > 0) {
        console.log("Found: grump(s)");
        res.grumps.forEach(function (grump) {
          console.log("\t" + grump.author.green + "/" + grump.defaultCommand.cyan);
        });
        console.log("");
      }

      // No matches found
      if (res.user.length === 0 && res.grumps.length === 0) {
        console.log("No matches".red + " for: " + search.cyan + " were found on the server.");
      }
    }
  });

};
