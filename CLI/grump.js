#!/usr/bin/env node

// required packages
var http = require('http');
var fs = require('fs');
var path = require('path');

// required files
var utils = require('./utils.js');

//global variables -- should factor out at some point
var url = "http://grumpy.keitharm.me/api/lib/";
var arg = process.argv.pop();
var fileName = arg + '.sh';
var filePath = path.join(__dirname ,'lib', fileName);

//run the file
if(fs.existsSync(filePath)) {
  utils.log("file exists");
  utils.runFile(filePath);

} else {
  utils.log("file dosen't exist");
  utils.loadFile(url+arg, filePath, utils.runFile);
}
