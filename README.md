## Information

[![Build Status](https://travis-ci.org/IxDay/angular-dependency.svg)](https://travis-ci.org/IxDay/angular-dependency)

<table>
<tr> 
<td>Package</td><td>angular-dependency</td>
</tr>
<tr>
<td>Description</td>
<td>Retrieve files needed by angular modules through your 
filesystem</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.10</td>
</tr>
</table>


##Usage
In order to retrieve the angular dependency tree a function is directly 
available on the package, here is an example:

```javascript
var angularDependency = require('angular-dependency');

//return an AngularModules object
var angularModules = angularDependency('/path/to/scan');

```

##AngularModules
This object contains all angular references needed to build a dependency tree:

```javascript
//retrieve the dependency tree of the module1, can throw a CircularDependency 
var dependencyTree = angularModules.resolve('module1');

//retrieve a flat representation of the dependencies of module1
var dependencyTree = angularModules.resolve('module1', true);
```

##AngularModulesFactory

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

## LICENSE

(MIT License)

Copyright (c) 2014 Maxime Vidori <maxime.vidori@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
