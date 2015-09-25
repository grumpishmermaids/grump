var client = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://grump:mermaids@ds051833.mongolab.com:51833/grump');

var packageSchema = new mongoose.Schema({
    githubID : Number,
    name : String,
    runFile : String,
    command : String,
    description : String,
    url : String,
    created_at : Date,
    updated_at : Date,
    pushed_at : Date,
    owner : {
      id : Number,
      login : String,
      avatar : String,
      url : String,
      kind : String
    }
});

var Package = mongoose.model('Package', packageSchema);

module.exports = Package;
