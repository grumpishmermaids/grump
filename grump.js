#!/usr/bin/env node

var path  = require('path');
var fs    = require('fs');
var color = require('colors');
var utils = require('./utils.js');

var action = process.argv[2] || "";
var args   = process.argv.slice(3);

// Perform initial run actions for 1st time running grump
utils.initialRun();

// Load in available commands
var cmds = [];
fs.readdirSync('./cmds').forEach(function(file) {
  cmds.push(file.slice(0, -3));
});

// Get installed grumps
var grumps = utils.getInstalledGrumps();

// Verbose logging
if (utils.config.verbose !== "false") {
  console.log("Loaded " + grumps.length + " grump" + (grumps.length === 1 ? "" : "s"));
  console.log("Action received:", action.green);
  console.log("Arguments received:", args.toString().cyan + "\n");
}

// Execute commands

if (action === undefined || action === "") {
  console.log("usage: grump [command] [args]");
  //require('./cmds/help')(args);
} else if (cmds.indexOf(action) !== -1) {
  require('./cmds/' + action)(args);
} else {
  console.log("Unknown command");
}
