var spawn = require('child_process').spawn;

//runs the file at a given path
var runFile = function (path) {
  log("running file");
  var childProcess = spawn('sh', [ path ], 
      { stdio: [ 0, 'pipe' ] });
  
  childProcess.stdout.on('data', function(data) {
    log(data.toString()); 
  });
};

//loads and writes file, then calls a callback on the file path
var loadFile = function(url, path, callback) {
  log("loading file");
  http.get(url, function(res) {
    utils.log("Got response: " + res.statusCode);

    //only writes file if it got back a good response
    if(res.statusCode === 200){
      var file = fs.createWriteStream(path);
      res.pipe(file);
      file.on('finish', function(){
        file.close(function() {
          callback(filePath);
        });
      });
    } 

  })
  .on('error', function(err) {
    utils.log("Got error: " + err.message);
  });
};

//shortens console.log so its less offensive to me
var log = function(arg) {
  console.log(arg);
};

exports.runFile = runFile;
exports.loadFile = loadFile;
exports.log = log;