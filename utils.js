var path   = require('path');
var fs     = require('fs');
var http   = require('http');
var https  = require("follow-redirects").https;
var mkdirp = require('mkdirp');
var exec   = require('child-process-promise').exec;
var spawn  = require('child_process').spawn;

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
  var combo = {};

  var grumps = fs.readdirSync(lodir('lib'));
  grumps.forEach(function(grump) {
    var group = [];
    var sub = fs.readdirSync(lodir('lib', grump));

    name.push(grump);
    sub.map(function(item) {
      group.push([item, grump]);
      specific.push(item + "/" + grump);
    });

    combo[grump] = group;
  });

  return [name, specific, combo];
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
var queryServer = function(grump, cb) {
  if (isVerbose()) console.log("Querying grumpjs server for grump " + grump.cyan);

  https.get(serverApiUrl + grump, function (res) {
    if (isVerbose()) console.log("Received statusCode " + res.statusCode.toString().green + " from server.");

    if (res.statusCode === 404) {
      cb("Error".red + ": Grump " + grump.cyan + " was not found on the server.", null);
    } else if (res.statusCode > 500) {
      cb("Error".red + ": Something went wrong on grumpjs. Please try again later.", null);
    } else if (res.statusCode === 200) {
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        body = JSON.parse(body);
        if (body.grumps.length === 0) {
          cb("Error".red + ": No grumps named " + grump.cyan + " were found.", body);
        } else {
          cb(null, body);
        }
      });
      res.on('error', function(err){
        cb(err, null);
      });
    }
  })
  .on('error', function(err) {
    cb(err, null);
  });
};

var install = function(repo, cb) {
  var command = repo.command;
  var author  = repo.owner.login;
  if (isVerbose()) { console.log("Installing " + author.green + "/" + command.cyan + "..."); }

  // Recursively create command and author directory
  mkdirp.sync(lodir("lib", command, author));

  // Clone from github
  var gitCloneCommand = 'git clone ' + repo.cloneUrl + ' ' + lodir("lib", command, author);
  exec(gitCloneCommand)
  .fail(function (err) {
    console.log("Error".red + ": Something went wrong while attempting to clone " + grump.cyan + ".");
  })
  .then(function () {
    // Write repo json file
    fs.writeFile(lodir("lib", command, author, ".grumpInstall.json"), JSON.stringify(repo), function(err) {
      if (err) {
        console.log("Error".red + ": Something went wrong while attempting to write Grump Installation file.");
      } else {
        cb();
      }
    });
  });
};


var run = function(grump, args) {
  var split = grump.indexOf("/");
  var commandName = grump.substr(split+1);
  var author = grump.substr(0, split);
  if (isVerbose()) { console.log("Executing " + author.green + "/" + commandName.cyan + " grump..."); }

  // Get the grump.json file
  var grumpjson = JSON.parse(fs.readFileSync(lodir("lib", commandName, author, "grump.json"), 'utf-8'));

  var defaultCommand = grumpjson.defaultCommand;
  var type = grumpjson.commands[defaultCommand].scriptType;
  var file = grumpjson.commands[defaultCommand].scriptPath;

  // Bash commands
  var cmd;
  if (type === "bash") {
    cmd = "sh";
  } else if (type === "node") {
    cmd = "node";
  }

  args.unshift(lodir("lib", commandName, author, file));

  var childProcess = spawn(cmd, args, {stdio: [
    0, // use parents stdin for child
    'pipe', // pipe child's stdout to parent
  ]});

  childProcess.stdout.on('data', function (data) {
    process.stdout.write(data);
  });

  childProcess.stderr.on('data', function (data) {
    //var str = data.toString();
    process.stderr.write(data);
  });

  childProcess.on('close', function (code) {
      //console.log('process exit code ' + code);
  });
};

exports.install = install;
exports.run = run;
exports.queryServer = queryServer;
exports.isVerbose = isVerbose;
exports.lodir = lodir;
exports.validLocalGrump = validLocalGrump;
exports.initialRun = initialRun;
exports.getInstalledGrumps = getInstalledGrumps;
exports.config = config();
exports.updateConfig = updateConfig;
