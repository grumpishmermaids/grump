var path = require('path');
var fs   = require('fs');
var serverApiUrl = "https://grumpjs.com/api/lib/";


// Local directory - wrap this around paths accessing the local
// node module folder and not the CWD grump is being executed from
var lodir = function(dir) {
  var newArgs = [__dirname];
  var args = Array.prototype.slice.call(arguments);
  newArgs = newArgs.concat(args);
  return path.join.apply(this, newArgs);
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

// Fetch and update config
var config = function() {
  return JSON.parse(fs.readFileSync(lodir('config.json'), 'utf-8'));
};

var updateConfig = function(obj) {
  fs.writeFileSync(lodir('config.json'), JSON.stringify(obj));
};

var validLocalGrump = function(cmd) {
  var type = 0;
  if (cmd.indexOf("/") !== -1) {
    type = 1;
  }

  return ((getInstalledGrumps()[type].indexOf(cmd)) === -1) ? false : true;
};

exports.lodir = lodir;
exports.validLocalGrump = validLocalGrump;
exports.initialRun = initialRun;
exports.getInstalledGrumps = getInstalledGrumps;
exports.config = config();
exports.updateConfig = updateConfig;
