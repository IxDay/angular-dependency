var assert   = require('assert');
var angularDependency = require('..');
var errors = require('../lib').errors;


describe('angular-dependency', function () {
  var modules;

  function getModules(path) {
    return angularDependency(path).angularModules();
  }

  describe('modules', function () {
    it('should retrieve all the modules through the given path',
      function () {
        var modules = {
          module1: {
            name: 'module1',
            defined: 'test/test_cases/test_case_01/file_0_1.js',
            dependencies: [],
            contents: []
          },
          module2: {
            name: 'module2',
            defined: 'test/test_cases/test_case_01/folder_1/file_1_1.js',
            dependencies: [],
            contents: []
          }
        };
        assert.deepEqual(
          modules, getModules('test/test_cases/test_case_01').modules);
      });

    it('should retrieve the module content and test, and provide them to ' +
        'the object', function () {
        modules = {
          module1: {
            name: 'module1',
            defined: 'test/test_cases/test_case_02/file_0_2.js',
            dependencies: [],
            contents: [
              'test/test_cases/test_case_02/file_0_1.js',
              'test/test_cases/test_case_02/file_0_3.js',
              'test/test_cases/test_case_02/file_0_4.js',
              'test/test_cases/test_case_02/file_0_5.js',
              'test/test_cases/test_case_02/file_0_6.js']}};

        assert.deepEqual(
          modules, getModules('test/test_cases/test_case_02').modules);
      });

    it('should retrieve the module dependencies and provide them to the ' +
      'object', function () {
      modules = {
        module2: {
          name: 'module2',
          defined: 'test/test_cases/test_case_03/file_0_1.js',
          dependencies: [],
          contents: ['test/test_cases/test_case_03/file_0_4.js'] },
        module1: {
          name: 'module1',
          defined: 'test/test_cases/test_case_03/file_0_2.js',
          dependencies: [ 'module2' ],
          contents: [ 'test/test_cases/test_case_03/file_0_3.js' ]}};

      assert.deepEqual(
        modules, getModules('test/test_cases/test_case_03').modules);
    });

    it('should handle different kind of syntax', function () {
      modules = {
        module1: {
          name: 'module1',
          defined: 'test/test_cases/test_case_04/file_0_1.js',
          dependencies: [],
          contents: [ 'test/test_cases/test_case_04/file_0_2.js' ] },
        module2: {
          name: 'module2',
          defined: 'test/test_cases/test_case_04/file_0_1.js',
          dependencies: [ 'module3', 'module1' ],
          contents: [ 'test/test_cases/test_case_04/file_0_2.js' ] },
        module3: {
          name: 'module3',
          defined: 'test/test_cases/test_case_04/file_0_1.js',
          dependencies: [],
          contents: [ 'test/test_cases/test_case_04/file_0_2.js' ] } };

      assert.deepEqual(
        modules, getModules('test/test_cases/test_case_04').modules);
    });

    it('should be possible to get the dependency tree of a specific module',
      function () {
        modules = {
          name: 'module1',
          defined: 'test/test_cases/test_case_05/file_0_1.js',
          dependencies: [
            {
              name: 'module2',
              defined: 'test/test_cases/test_case_05/file_0_1.js',
              dependencies: [],
              contents: [] },
            {
              name: 'module3',
              defined: 'test/test_cases/test_case_05/file_0_1.js',
              dependencies: [
                {
                  name: 'module4',
                  defined: 'test/test_cases/test_case_05/file_0_1.js',
                  dependencies: [],
                  contents: []
                }],
              contents: []}],
          contents: []
        };
        assert.deepEqual(
          modules,
          getModules('test/test_cases/test_case_05').resolve('module1'));
      });

    it('should be possible to flatten this tree as a AngularModules object',
      function () {
        modules = [{
          name: 'module2',
          defined: 'test/test_cases/test_case_05/file_0_1.js',
          dependencies: [],
          contents: []
        }, {
          name: 'module4',
          defined: 'test/test_cases/test_case_05/file_0_1.js',
          dependencies: [],
          contents: []
        }, {
          name: 'module3',
          defined: 'test/test_cases/test_case_05/file_0_1.js',
          dependencies: [{
            name: 'module4',
            defined: 'test/test_cases/test_case_05/file_0_1.js',
            dependencies: [],
            contents: []
          }],
          contents: []
        }, {
          name: 'module1',
          defined: 'test/test_cases/test_case_05/file_0_1.js',
          dependencies: [{
            name: 'module2',
            defined: 'test/test_cases/test_case_05/file_0_1.js',
            dependencies: [],
            contents: []
          }, {
            name: 'module3',
            defined: 'test/test_cases/test_case_05/file_0_1.js',
            dependencies: [{
              name: 'module4',
              defined: 'test/test_cases/test_case_05/file_0_1.js',
              dependencies: [],
              contents: []
            }],
            contents: []
          }],
          contents: []
        }];
        assert.deepEqual(
          modules,
          getModules('test/test_cases/test_case_05').resolve('module1', true));
      });

    it('should be possible to get the dependency tree with an excluded dependency',
      function () {
        modules = [{
          name: 'module2',
          defined: 'test/test_cases/test_case_05/file_0_1.js',
          dependencies: [],
          contents: []
        }, {
          name: 'module1',
          defined: 'test/test_cases/test_case_05/file_0_1.js',
          dependencies: [{
            name: 'module2',
            defined: 'test/test_cases/test_case_05/file_0_1.js',
            dependencies: [],
            contents: []
          }],
          contents: []
        }];
        assert.deepEqual(
          modules,
          getModules('test/test_cases/test_case_05').resolve('module1', true, 'module3'));
      });

    it('should be possible to get the dependency tree with excluded dependencies',
      function () {
        modules = [{
          name: 'module3',
          defined: 'test/test_cases/test_case_05/file_0_1.js',
          dependencies: [],
          contents: []
        }, {
          name: 'module1',
          defined: 'test/test_cases/test_case_05/file_0_1.js',
          dependencies: [{
            name: 'module3',
            defined: 'test/test_cases/test_case_05/file_0_1.js',
            dependencies: [],
            contents: []
          }],
          contents: []
        }];
        assert.deepEqual(
          modules,
          getModules('test/test_cases/test_case_05')
            .resolve('module1', true, ['module2', 'module4']));
      });
  });

  describe('errors', function (){
    it('should throw an error if a module has not been defined', function () {
      assert.throws(
        function() {
          getModules('test/test_cases/test_case_06');
        },
        errors.NotDefined
      );
    });

    it('should throw an error if a module has already been defined',
      function () {
        assert.throws(
          function() {
            getModules('test/test_cases/test_case_07');
          },
          errors.AlreadyDefined
        );
      });

    it('should throw an error if a circular dependency exists',
      function () {
        assert.throws(
          function() {
            getModules('test/test_cases/test_case_08').resolve('module1');
          },
          errors.CircularDependency
        );
      });

    it('should throw an error if a module resolution does not exist',
      function () {
        assert.throws(
          function() {
            getModules('test/test_cases/test_case_08').resolve('module4');
          },
          errors.NotDefined
        );

        assert.throws(
          function() {
            getModules('test/test_cases/test_case_09').resolve('module1');
          },
          errors.NotDefined
        );
    });

    it('should throw an error if a module implementation does not exist',
      function () {
        assert.throws(
          function() {
            getModules('test/test_cases/test_case_09').resolve('module1');
          },
          errors.NotDefined
        );
    });

  });
});
