#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var http = require('http');
var spawn = require('child_process').spawn;

//get the argument
var arg = process.argv.pop();

var fileName = arg + '.sh';
var filePath = path.join(__dirname ,'lib', fileName);

if (fs.existsSync(filePath)) {
  console.log("exists");
  var child = spawn('sh', [ filePath ], { stdio: [
    0, // use parents stdin for child
    'pipe', // pipe child's stdout to parent
  ] });

  child.stdout.on('data', function(data) {
    console.log(data.toString()); 
  });

} else {
  http.get("http://grumpy.keitharm.me/api/lib/" + arg, function(res) {
    console.log("Got response: " + res.statusCode);
    if(res.statusCode === 200){
        var file = fs.createWriteStream(filePath);

        res.pipe(file);

        file.on('finish', function(){
            file.close(function() {
              spawn('sh', [ filePath ]);
            });
        });
      } 
    }).on('error', function(err) {
      console.log("Got error: " + err.message);
    });
}
    