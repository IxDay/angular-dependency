var _  = require('lodash');


function AlreadyDefined (module, file) {
  this.name = 'AlreadyDefined';
  this.message = ['The module: ', module.name, ' defined in ', file,
    ' has already been defined in ', module.defined].join('');
}
AlreadyDefined.prototype = Error.prototype;


function NotDefined (module) {
  this.name = 'NotDefined';
  var message =
    ['The module ', module.name || module, ' has not been defined'];

  if (module.contents && module.contents.length) {
    message.splice(2,0, ' used in ', module.contents.join(', '));
  }
  this.message = message.join('');
}
NotDefined.prototype = Error.prototype;


function CircularDependency (module, dependency) {
  this.name = 'CircularDependency';
  this.message = ['There is a circular dependency between ', module.name,
    ' and ', dependency.name].join('');
}
CircularDependency.prototype = Error.prototype;


function AngularModules () {
  this.modules = {};
}

AngularModules.prototype = {
  addModule: function (name, dependencies, file) {
    var module = this.modules[name];
    if (!module) {
      module = this.modules[name] = {
        name         : name,
        defined      : null,
        dependencies : null,
        contents     : []
      };
    }

    if (dependencies instanceof Array) {
      if (module.defined) {
        throw new AlreadyDefined(module, file);
      }
      module.dependencies = dependencies;
      module.defined = file;
    } else {
      file = dependencies;
      if (module.defined !== file) {
        module.contents.push(file);
      }
    }
    return module;
  },

  resolve: function (module, flat, exclude) {
    if (typeof flat !== 'boolean') { exclude = flat; }
    if (typeof exclude === 'string') { exclude = [exclude]; }
    //copy this.modules in order to not modify it in the resolve function
    function copyModules () {
      var modules = _.clone(this.modules, true);

      return _.each(modules, function (module){
        module.dependencies = _(module.dependencies)
          .filter(function (dependency) {
            return _.indexOf(exclude, dependency) == -1
          })
          .map(function (dependency) {
            return modules[dependency];
          })
          .value();
        });
    }

    /*
     see http://www.electricmonk.nl/log/2008/08/07/dependency-resolving-algorithm/
     */
    function walk (module, resolved, unresolved) {
      unresolved.push(module);
      _.each(module.dependencies, function (dependency) {
        if (!_.find(resolved, {name: dependency.name})) {
          if (_.find(unresolved, {name: dependency.name})) {
            throw new CircularDependency(module, dependency);
          }
          walk(dependency, resolved, unresolved);
        }
      });
      resolved.push(module);
      _.remove(unresolved, function (m) {
        return m.name === module.name;
      });
    }

    var modules = copyModules.call(this);
    var resolved = [];
    var m = modules[module.name || module];

    if (!m) {
      throw new NotDefined(module);
    }
    walk(m, resolved, []);
    return flat ? resolved : m;
  }
};

function AngularModulesFactory () {
  var _angularModules = new AngularModules();
  var module_declaration =
    /angular\.module\((?:'|")(.*?)(?:'|"),\[([^\]]*)\][^\)]*/gi;

  var module_content = new RegExp([
    '(?:angular\\.|angular\\.mock\\.|window\\.|)',
    'module\\((?:\'|")([^\']*)(?:\'|")[^\\[]*?\\)'].join(''), 'gi');

  function retrieveDependencies (str) {
    var dependencies = str.split(',');
    if (!dependencies[0]) { return []; }
    return _.map(dependencies, function (dependency) {
      return dependency.trim().slice(1, -1);
    });
  }

  this.processFile = function (content, path) {
    var results;

    content = content.replace(/\s/g, '');

    while ((results = module_declaration.exec(content)) !== null) {
      _angularModules.addModule(results[1], retrieveDependencies(results[2]), path);
    }

    while ((results = module_content.exec(content)) !== null) {
      _angularModules.addModule(results[1], path);
    }
  };

  this.angularModules = function () {
    _.each(_angularModules.modules, function (module) {
      if (!module.defined) {
        throw new NotDefined(module);
      }
    });
    return _angularModules;
  };
}

module.exports = {
  AngularModulesFactory: AngularModulesFactory,
  errors: {
    AlreadyDefined: AlreadyDefined,
    NotDefined: NotDefined,
    CircularDependency: CircularDependency
  }
};
