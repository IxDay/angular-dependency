var assert   = require('assert');
var utilsLib = require('../utils');


describe('utils', function () {

	describe('listFiles', function () {
		it('should list all files in the sample directory', function () {
			var sampleFiles = [
			'test/sample/content/content.js',
			'test/sample/content/dependency3content/dependency3content.js',
		  'test/sample/dependencies/dependency1.js',
		  'test/sample/dependencies/dependency2/content/dependency2content.js',
		  'test/sample/dependencies/dependency2/dependency2.js',
		  'test/sample/dependencies/dependency3/dependency3.js',
		  'test/sample/dependencies/dependency5.js',
		  'test/sample/dependencies/foo.js',
		  'test/sample/main.js' ];

			assert.deepEqual(utilsLib.listFiles('test/sample', []), sampleFiles);
		});
	});

	describe('angularContent', function () {
		it('should create an object with the modules name and the files needed', 
			function () {
				var util = require('util');
				var m = utilsLib.angularModules(utilsLib.listFiles('test/sample', []));
				console.log(util.inspect(m.resolve('main', true), {depth: null}));
			});
	});
});