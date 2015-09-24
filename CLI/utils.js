var http = require('http');
var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;

//TODO: better way to handle server URL?
var serverApiUrl = "http://grumpy.keitharm.me/api/lib/";

//runs the script file at a given path
var runScript = function (filePath) {  //should this take 
  log("Running script at path:", filePath);
  
  //create a child process* & pipe any standard input/output to this parent process
  //(so console logs, prompts, etc. appear in terminal where grump was run)
  //(*see Node API for details: https://nodejs.org/api/child_process.html)
  //NOTE: for now only does BASH. (TODO: commonjs scripts via node?)
  var childProcess = spawn('sh', [filePath], { stdio: [0, 'pipe'] });
  childProcess.stdout.on('data', function (data) {
    log(data.toString()); 
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
exports.downloadScript = downloadScript;
exports.log = log;