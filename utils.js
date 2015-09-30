var path  = require('path');
var fs    = require('fs');
var http  = require('http');
var https = require("follow-redirects").https;

var serverApiUrl = "https://grumpjs.com/api/lib/";

// Local directory - wrap this around paths accessing the local
// node module folder and not the CWD grump is being executed from
var lodir = function(dir) {
  var newArgs = [__dirname];
  var args = Array.prototype.slice.call(arguments);
  newArgs = newArgs.concat(args);
  return path.join.apply(this, newArgs);
};

// Fetch and update config
var config = function() {
  return JSON.parse(fs.readFileSync(lodir('config.json'), 'utf-8'));
};

var updateConfig = function(obj) {
  fs.writeFileSync(lodir('config.json'), JSON.stringify(obj));
};

// Quick check to know if verbose messages should be displayed
var isVerbose = function() {
  return config().verbose === "true";
};

// Make the lib dir if it doesn't exist
var initialRun = function() {
  try {
    fs.mkdirSync(lodir('lib'));
  } catch (e) {}
};

// Scan lib directory for installed grumps
var getInstalledGrumps = function() {
  var name = [];
  var specific = [];

  var grumps = fs.readdirSync(lodir('lib'));
  grumps.forEach(function(grump) {
    var sub = fs.readdirSync(lodir('lib', grump));
    name.push(grump);
    sub.map(function(item) {
      specific.push(item + "/" + grump);
    });
  });

  return [name, specific];
};

// Check if grump ( specific (keith/hello) or general (hello) ) exists
var validLocalGrump = function(grump) {
  var type = 0;
  if (grump.indexOf("/") !== -1) {
    type = 1;
  }

  return ((getInstalledGrumps()[type].indexOf(grump)) === -1) ? false : true;
};

// Query Grumpjs server for grump
var queryServer = function(grump) {
  if (config().isVerbose) console.log("Querying grumpjs server for grump " + grump.cyan);

  https.get(serverApiUrl + grump, function (res) {
    if (config().isVerbose) console.log("Received statusCode " + res.statusCode.toString().green + " from server.");

    if (res.statusCode === 404) {
      console.log("Error".red + ": Grump " + grump.cyan + " was not found on the server.");
    } else if (res.statusCode > 500) {
      console.log("Error".red + ": Something went wrong on grumpjs. Please try again later.");
    } else if (res.statusCode === 200) {
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        console.log(body);
        // var grumpScriptInfo = JSON.parse(body);
        // log("Got new grump! \n--Command: %s \n--scriptFile: %s \n--Author: %s", grumpScriptInfo.command, grumpScriptInfo.runFile, grumpScriptInfo.owner.login);
        // //resolve(grumpScriptInfo);
      });
      res.on('error', function(err){
        console.log("Error".red + ": " + err);
      });
    }
  })
  .on('error', function(err) {
    console.log("Error".red + ": " + err);
  });
};

exports.queryServer = queryServer;
exports.isVerbose = isVerbose;
exports.lodir = lodir;
exports.validLocalGrump = validLocalGrump;
exports.initialRun = initialRun;
exports.getInstalledGrumps = getInstalledGrumps;
exports.config = config();
exports.updateConfig = updateConfig;
