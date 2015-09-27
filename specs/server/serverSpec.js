var expect   = require('chai').expect;
var assert   = require('chai').assert;
var request  = require('supertest');
var config   = require('../../server/config.json');
var mongoose = require('mongoose');
var GitHubApi = require('github');
describe('', function() {

  // before(function(done) {
  //   mongoose.connect("mongodb://" + config.mongo.username + ":" + config.mongo.password + "@" + config.mongo.host + "/" + config.mongo.db, function() {
  //     mongoose.connection.db.dropCollection('packages_test', function(err, res) {
  //       mongoose.connection.close();
  //       done();
  //     });
  //   });
  // });

  describe('Configuration file should be populated', function() {

    it('should have Github config values filled out', function() {
      expect(config.github.key).to.not.equal("");
      expect(config.github.secret).to.not.equal("");
    });

    it('should have Mongo config values filled out', function() {
      expect(config.mongo.username).to.not.equal("");
      expect(config.mongo.password).to.not.equal("");
    });

    it('should have valid Github credentials', function(done) {
      var github = new GitHubApi({
          version: "3.0.0",
          debug: false,
          protocol: "https",
          host: "api.github.com",
          timeout: 5000,
          headers: {
              "user-agent": "Grump"
          }
      });

      github.authenticate({
          type: "oauth",
          key: config.github.key,
          secret: config.github.secret
      });

      github.repos.get({
        user: 'git',
        repo: 'git',
      }, function(err, res) {
        
        // If the credentials aren't valid, it'll default to the
        // unauthenticated rate limiting of 60 requests per hour
        expect(res.meta["x-ratelimit-limit"]).to.not.equal('60');
        done();
      });
    });

    it('should have valid Mongo credentials', function(done) {
      mongoose.connect("mongodb://" + config.mongo.username + ":" + config.mongo.password + "@" + config.mongo.host + "/" + config.mongo.db);
      mongoose.connection.on("connected", function(ref) {
        expect(ref).to.not.equal("");
        done();
      });
    });
  });

  describe('Server routing', function() {
    it('should return 200 when accessing /', function(done) {
      request('http://localhost:3000')
        .get('/')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should accept POST requests on /api/submit', function(done) {

      var data = {
        repo: 'https://github.com/grumpishmermaids/hello',
        runFile: 'hello.sh',
        command: 'hello'
      };

      request('http://localhost:3000')
        .post('/api/submit')
        .send(data)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });
});