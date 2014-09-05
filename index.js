var fs  = require('fs');
var _   = require('lodash');
var lib = require('./lib');

function listFiles (filename, files) {
  var stats = fs.lstatSync(filename);

  files = files || [];

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

function processPath (path) {
  var angularModulesFactory = new lib.AngularModulesFactory();
  var files = listFiles(path);
  _.map(files, function (path) {
    var content = fs.readFileSync(path).toString();
    angularModulesFactory.processFile(content, path);
  });

  return angularModulesFactory;
}


module.exports = processPath;