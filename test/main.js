var assert = require('assert');
var angularDependency = require('../');


describe('angular-dependency', function () {

  it('should return an hello function', function () {
  	assert.equal(angularDependency.hello(), 'Hello World!');		
  });
});