var color = require('colors');
var utils = require('../utils.js');
var pack  = require('../package.json');
var _     = require('lodash');

module.exports = function(args) {
  var grumps = utils.getInstalledGrumps()[2];
  var index  = 0;
  var total  = Object.keys(grumps).length;

  var total_grumps = utils.getInstalledGrumps()[1].length;

  console.log("grump@" + pack.version + " - " + total_grumps + " local grump" + (total_grumps === 1 ? "" : "s"));
  _.each(grumps, function(grump, key) {

    if (index+1 < total) {
      more = "|";
    } else {
      more = " ";
    }

    console.log("└─ " + grump[0][1].cyan);

    var times = 0;
    var multi = false;
    if (Object.keys(grump).length > 1) {
      multi = true;
    }

    _.each(grump, function(specific) {
      var sym;

      if (times++ === 0 && multi) {
        sym = more + "  ├─ ";
      } else {
        sym = more + "  └─ ";
      }

      console.log(sym + specific[0].green);
    });

    index++;
  });
};
