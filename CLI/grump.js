#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var http = require('http');
var spawn = require('child_process').spawn;

//get the argument
var fileName = process.argv.pop() + '.sh';
var filePath = path.join(__dirname ,'lib', fileName);

//check if i have it
var file = fs.statSync(filePath);

if(file.isFile()) {
  spawn('sh', [ filePath ]);
} else {
  http.get("http://grumpy.keitharm.me/api/lib/" + arg, function(res) {
    console.log("Got response: " + res.statusCode);
    var writeStream = fs.createWriteStream(filePath);

    res.pipe(writeStream);

    writeStream.on('finish', function(){
        file.close(function() {
          spawn('sh', [ filePath ]);
        });
    });

  }).on('error', function(err) {
    console.log("Got error: " + err.message);
  });

}




// var file = fs.stats(path)
// if(file.isFile())

  // look in lib
  // --if this is the first time i run it do i save it?

//have we done this already

//make call to api with argument

//return file from api

//run file
// console.log(arg);
// console.log(process.env.HOME + '/desktop/grump/cli');