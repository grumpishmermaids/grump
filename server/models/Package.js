var mongoose = require('../helpers/db.js');

var packageSchema = new mongoose.Schema({
  githubID : Number,
  repoName : String,
  runFile : String,
  command : String,
  description : String,
  url : String,
  cloneUrl : String,
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
