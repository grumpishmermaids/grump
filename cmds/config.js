var path  = require('path');
var fs    = require('fs');
var utils = require('../utils.js');

module.exports = function(args) {
  if (args[0] === undefined) {
    console.log("Error".red + ": Please provide the name of a grump to config.");
    return;
  } else if (args[0] === "grump") {

    args = args.slice(1);

    var config = utils.config;

    if (args.length === 0) {
      console.log(config);
    } else if (args.length === 1) {
      console.log(config[args[0]]);
    } else {
      var old = config[args[0]];
      config[args[0]] = args[1];
      utils.updateConfig(config);
      console.log(old + " => " + args[1]);
    }
  } else {
    var grump = args[0];
    if (!utils.validLocalGrump(grump)) {
      console.log("Error".red + ": grump " + grump.cyan + " was not found.");
      return;
    }

    var installedGrumps = utils.getInstalledGrumps();

    if (grump.indexOf("/") !== -1) {
      config(grump, args.slice(1));

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
        config(chosen[0] + "/" + chosen[1], args.slice(1));
      }
    }

    function config(grump, args) {
      var index       = grump.indexOf("/");
      var author      = grump.slice(0, index);
      var generalName = grump.slice(index+1);

      // Fetch grump.json of package
      var json = JSON.parse(fs.readFileSync(utils.lodir("lib", generalName, author, "grump.json"), 'utf-8'));
      var defaultCommand = json.defaultCommand;
      var vars = json.commands[defaultCommand].persist_vars;

      var key = args[0];
      var val = args[1];

      if (key === undefined) {
        console.log(vars);
      } else {
        if (val !== undefined) {
          console.log(vars[key] + " => " + val);
          json.commands[defaultCommand].persist_vars[key] = val;
        } else {
          console.log(vars[key]);
        }
      }

      fs.writeFileSync(utils.lodir("lib", generalName, author, "grump.json"), JSON.stringify(json));
    }

  }
};
