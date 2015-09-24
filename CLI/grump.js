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


console.dir(process.argv);

// get arguments to grump command
var scriptName = process.argv.pop();  //TODO: make this intelligent.
console.log("Processing command < %s >", scriptName);

var fileName = scriptName + '.sh'; //assumption: we only have bash scripts
                            //TODO: if allowing node, this has to change (just to key value store?)

var grumpScriptDirectory = path.join(__dirname ,'lib');
utils.log("Grump script directory is:", grumpScriptDirectory);

//grunt.js lives wherever npm puts modules you install "globally" (i.e. when using "-g" option on npm install)
// ( --> so __dirname should be something like "/usr/local/lib/node_modules")
//so our local stored scripts directory is at "[global node_modules directory]/grump/lib" 

//TODO: turn fileName into directory? run script in that directory identified by key/value pair of command name
var filePath = path.join(grumpScriptDirectory, fileName);
utils.log("Expected local file path is:", filePath);


//if script file exists locally, run it.
//Otherwise, get it from server, then run it.
if(fs.existsSync(filePath)) {  //TODO: fix to non-deprecated file check
  utils.log("Script < %s > found in local storage!", scriptName);
  utils.runScript(filePath);
} else {
  utils.log("Could not find script < %s > locally.", scriptName);
  utils.downloadScript(scriptName, filePath, utils.runScript); 
  //TODO: refactor download to use promise, not callback
}