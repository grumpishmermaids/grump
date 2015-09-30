var path = require('path');
var fs   = require('fs');
var serverApiUrl = "https://grumpjs.com/api/lib/";

// Make the lib dir if it doesn't exist
var initialRun = function() {
  // Create lib folder if it doesn't exist
  fs.readFile('lib', function (err, data) {
    if (err.code !== "EISDIR") {
      fs.mkdirSync('lib');
    }
  });
};

// Scan lib directory for installed grumps
var getInstalledGrumps = function() {
  var name = [];
  var specific = [];

  var grumps = fs.readdirSync('lib');
  grumps.forEach(function(grump) {
    var sub = fs.readdirSync("lib/" + grump);
    name.push(grump);
    sub.map(function(item) {
      specific.push(item + "/" + grump);
    });
  });

  return [name, specific];
};

var config = function() {
  return JSON.parse(fs.readFileSync('config.json', 'utf-8'));
};

var updateConfig = function(obj) {
  fs.writeFileSync('config.json', JSON.stringify(obj));
};

var validCommand = function(cmd) {
  var type = 0;
  if (cmd.indexOf("/")) {
    type = 1;
  }

  return ((getInstalledGrumps()[type].indexOf(cmd)) === -1) ? false : true;
};

exports.validCommand = validCommand;
exports.initialRun = initialRun;
exports.getInstalledGrumps = getInstalledGrumps;
exports.config = config();
exports.updateConfig = updateConfig;
