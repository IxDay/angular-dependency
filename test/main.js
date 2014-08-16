var assert            = require('assert');
var _                 = require('lodash');
var angularDependency = require('../');


describe('angular-dependency', function () {

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

			var files = [];
			angularDependency.listFiles('test/sample', files);

			var t  = _(files)
			.zip(sampleFiles)
			.each(function (files) {
				assert.equal(files[0], files[1]);
			});
			
		});
	});
});