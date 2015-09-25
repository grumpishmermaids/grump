var mongoose = require('mongoose');
var config = require('../config');

module.exports = mongoose.connect("mongodb://" + config.mongo.username + ":" + config.mongo.password + "@ds051833.mongolab.com:51833/grump");
