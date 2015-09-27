var mongoose = require('mongoose');
var config = require('../config');

module.exports = mongoose.connect("mongodb://" + config.mongo.username + ":" + config.mongo.password + "@" + config.mongo.host + "/" + config.mongo.db);
