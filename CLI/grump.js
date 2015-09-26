#!/usr/bin/env node

// ### !!IMPORTANT README!! ###
//  The first line of this file that starts with hashbang ("#!") IS NOT A COMMENT. DO NOT DELETE.
//  It's part of the magic grump a CLI (Command Line Interface) -- see explanation below
//    ##THE MAGIC##
//    -PART 1: We set a "bin" option in our package.json that makes a "grump" command (in "/usr/bin") that points to this grump.js file
//            (note: grump.js is in turn copied to /usr/local/lib/node_modules/grump by "npm install -g").
//    -PART 2: The hashbang on line 1 tells the shell (where you ran the command) to execute whatever your
//             local user environment ("/usr/bin/env") thinks the "node" command is on everything that follows.
//    -PART 3: All words typed in the original command (e.g. "grump make me a sandwich")
//             get stored in an environment object (array) called "process.argv", which we will now use to get the grump arguments.

// required node packages
var path = require('path');
var fs = require('fs');
var utils = require('./utils.js');  //local
var log = utils.log; //laziness!


//we'll just assume whatever comes after "grump" is the command,
//and pass that command the rest of the arguments
//TODO: make this more cleverer? flexibleler?
var scriptName = process.argv[2];  
var scriptArgs = process.argv.slice(3);

if (!scriptName) {
  log("Grump needs something to grump. Try again?");
}

// get arguments to grump command
log("Processing command '%s'", scriptName);

var knownGrumps = utils.loadKnownGrumps(); //load known grump commands

if (knownGrumps[scriptName]) { //if known locally, just run script
  utils.log("Script '%s' found in local storage!", scriptName);
  utils.runScript(knownGrumps[scriptName]);
} else {
  utils.findGrumpInfoOnServer(scriptName) //else find it on server
  .catch(function (error) {
    log("Couldn't fetch from server because...", error);
  })
  .then(function (scriptInfo) {
    knownGrumps[scriptName] = scriptInfo;  //based on info from server  
    utils.downloadFromGit(scriptInfo)      //download grump from git
    .catch(function (error) {
      log("Couldn't fetch from github because...", error);
    })
    .then(function () {
      utils.runScript(scriptInfo);  //then run script
      utils.updateKnownGrumps(knownGrumps); //if all went well, update known grumps in memory
    });
  });
}