angular.module('module1', ['module2']);

angular.module('module2', ['module3']);

angular.module('module3', ['module1']);