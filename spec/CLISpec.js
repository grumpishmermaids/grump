var request = require('supertest');
var expect = require('chai').expect;
var utils = require('../../CLI/utils.js');
// var grump = require( '../../CLI/grump.js');


describe('utils.js', function(){
  it('should have a loadKnownGrumps method',function(){
    expect(utils.loadKnownGrumps).to.be.ok;
  });
});