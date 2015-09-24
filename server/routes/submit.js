var express   = require('express');
var path      = require('path');
var config    = require('../config.json');
var request   = require('request');
var url       = require('url');
var GitHubApi = require('github');
var router    = express.Router();

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

// Submitting a package into Grump Library
router.post('/', function(req, res, next) {
  var info = {};
  var repo = url.parse(req.body.repo).path.slice(1).split('/');

  // Get Repo data
  github.repos.get({
    user: repo[0],
    repo: repo[1],
  }, function(err, ret) {
    if (err) console.log(err);

    info["id"] = ret.id;
    info["name"] = ret.name;
    info["description"] = ret.description;
    info["url"] = ret.url;
    info["created_at"] = ret.created_at;
    info["updated_at"] = ret.updated_at;
    info["pushed_at"] = ret.pushed_at;
    info["owner"] = {};
    info["owner"]["id"] = ret.owner.id;
    info["owner"]["avatar"] = ret.owner.avatar_url;
    info["owner"]["url"] = ret.owner.url;
    info["owner"]["type"] = ret.owner.type

    // Fetch latest commit data
    github.repos.getCommits({
      user: repo[0],
      repo: repo[1],
      page: 1,
      per_page: 1
    }, function(err, ret) {
      info["last_commit"] = ret[0].sha;
      info["download"] = "https://github.com/" + repo[0] + "/" + repo[1] + "/archive/" + info["last_commit"] + ".zip";

      // Send back collected data for now
      res.set({'Content-Type': 'application/json; charset=utf-8'}).status(200).send(JSON.stringify(info, undefined, ' '));
    });
  });
});

module.exports = router;
