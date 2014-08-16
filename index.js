var fs = require('fs');
var _  = require('lodash');

function listFiles (filename, files) {
    var stats = fs.lstatSync(filename);

    if (stats.isDirectory()) {
        _.map(fs.readdirSync(filename), function (child) {
            return listFiles(filename + '/' + child, files);
        });
    }
    if (stats.isFile()) {
        files.push(filename);
    }
    return files;
}

function angularDep (files) {
	files.map(function (file) {
		var content = fs.readFileSync(file);
		var regex =
		/angular\s*.\s*module\s*\(\s*'(.*?)'\s*,\s*\[([^\]]*)\][^\)]*/gi;

		var results = regex.exec(content.toString());
		if (results) {
			console.log('name: ', results[1]);
			console.log('dependencies: ');
			_.map(results[2].split(','), function (dependency) {
				if (dependency) {
					console.log('\t', dependency.trim().slice(1, -1));
				}
			});
			console.log('');
		}
	})
}

function angularContent (files) {
	files.map(function (file) {
		var content = fs.readFileSync(file);
		var regex = /angular\s*.module\s*\(\s*'([^']*)'[^\[]*?\)/gi;

		var results = regex.exec(content.toString());
		if (results) {
			console.log('file: ', file)
			console.log('name: ', results[1]);
		}

	});
}

// // angularDep(listFiles(basePath, []));
// angularContent(listFiles(basePath, []));

module.exports = {
	listFiles: listFiles
}