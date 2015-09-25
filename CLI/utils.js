var http = require('http');
var https = require("follow-redirects").https;
var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');
var exec = require('child-process-promise').exec;  //Promisified version!
var spawn = require('child_process').spawn;

//TODO: better way to handle server URL?
var serverApiUrl = "http://grumpy.keitharm.me/api/lib/";
var grumpScriptDirectory = path.join(__dirname ,'lib');


var loadKnownGrumps = function() {
  //TODO? error catching?

  var knownGrumpsFile = path.join(grumpScriptDirectory, 'grumps.json');
  var knownGrumps = JSON.parse(fs.readFileSync(knownGrumpsFile));
  
  log('Loaded %s known grumps!', Object.keys(knownGrumps).length);
  return knownGrumps;
};

var updateKnownGrumps = function(knownGrumps) {
  //TODO? error catching?
  var knownGrumpsFile = path.join(grumpScriptDirectory, 'grumps.json');
  fs.writeFileSync(knownGrumpsFile, knownGrumps);
  
  log('Updated known grumps to %s!', Object.keys(knownGrumps).length);
};

//runs the script file at a given path
var runScript = function (scriptInfo) {  //should this take 
  var scriptPath = path.join(grumpScriptDirectory, scriptInfo.runFile);
  log("Running script at path:", scriptPath);
  
  //create a child process* & pipe any standard input/output to this parent process
  //(so console logs, prompts, etc. appear in terminal where grump was run)
  //(*see Node API for details: https://nodejs.org/api/child_process.html)
  //NOTE: for now only does BASH. (TODO: commonjs scripts via node?)
  var childProcess = spawn('sh', [scriptPath], { stdio: [0, 'pipe'] });
  childProcess.stdout.on('data', function (data) {
    log(data.toString()); 
  });
};


var findGrumpInfoOnServer = function (scriptName) {
  return new Promise(function (resolve, reject) {
    log("Requesting match for grump < %s > from server...", scriptName);
 
    var pathOnServer = serverApiUrl + scriptName;

    http.get(pathOnServer, function (res) {
      log("Got response: %s", res.statusCode); //TODO include body.message from server
      
      if (res.statusCode === 404) {
        throw new Error("Script %s not found on server.", scriptName);
      } else if (res.statusCode > 500) {
        throw new Error("Server borked. Please try again later!");
      } else if (statusCode === 200) {
        var body = '';
        res.on('data', function(chunk) {
          body += chunk;
        });
        res.on('end', function() {
          var grumpScriptInfo = JSON.parse(body);
          resolve(grumpScriptInfo);
        });
      }
    }).on('error', function(err) {
      reject(err);
    });
  });

};


//clone GIT repo to local folder
var downloadFromGit = function (scriptInfo) {
  return new Promise(function (resolve, reject) {
    var newScriptDirectory = path.join(grumpScriptDirectory, scriptInfo.command);
    var gitCloneCommand = 'git clone ' + scriptInfo.cloneUrl + ' ' + newScriptDirectory;
    exec(gitCloneCommand)
    .fail(function (err) {
      reject(err);
    })
    .then(function () {
      resolve();
    });
  });
};




//TODO: refactor to use promise instead of callback
//loads and writes file, then calls a callback on the file path
var downloadScript = function (scriptName, localFilePath, callback) {
  log("Requesting match for grump < %s > from server...", scriptName);
  var pathOnServer = serverApiUrl + scriptName;
  http.get(pathOnServer, function (res) {
    log("Got response: %s -- %s", res.statusCode); //TODO include body.message from server

    //only writes file if it got back a good response
    //TODO: better logging?
    if (res.statusCode === 200) {
      var newFile = fs.createWriteStream(localFilePath);
      res.pipe(newFile);
      newFile.on('finish', function () {
        newFile.close(function () {
          callback(localFilePath);
        });
      });
    }
  })
  .on('error', function (err) {
    log("Got error: " + err.message);
  });
};

//FORNOW: shortens console.log so its less offensive to me
var log = console.log; //TODO: in future, log to a logfile?

exports.runScript = runScript;
exports.downloadFromGit = downloadFromGit;
exports.downloadScript = downloadScript;
exports.log = log;