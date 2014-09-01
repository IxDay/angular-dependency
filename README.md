angular-dependency
==================

Retrieves angular modules through your filesystem.


#How to
In order to retrieve the angular dependency tree a function is directly 
available on the package, here is an example:

```javascript
var angularDependency = require('angular-dependency');

//return an AngularModules object
var angularModules = angularDependency('/path/to/scan');

```

#AngularModules
This object contains all angular references needed to build a dependency tree:

```javascript
//retrieve the dependency tree of the module1, can throw a CircularDependency 
var dependencyTree = angularModules.resolve('module1');

//retrieve a flat representation of the dependencies of module1
var dependencyTree = angularModules.resolve('module1', true);
```

#AngularModulesFactory

This object is provided by the lib file, all errors are also publicly available
in this module.

usage:
```javascript
var angularModulesFactory = new AngularModulesFactory();


var path = 'file/path';
var content = fs.readdirSync(path).toString();

/*
 * Process file in order to extract angular modules definition, can throw
 * an AlreadyDefined exception if a module with the same name is defined 
 * multiple times
 */
angularModulesFactory.processFile(content, path);


/*
 * Retrieves the AngularModules object from the factory, can throw a NotDefined
 * exception if a module is has not been initialized in the angular files.
 */
var angularModules =  angularModulesFactory.getModules();

```
