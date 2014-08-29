var assert   = require('assert');
var angularDependency = require('..');


describe('angular-dependency', function () {

  describe('listFiles', function () {
    it('should list all files in the given directory', function () {
      var sampleFiles = [
        'test/test_cases/test_case_1/file_0_1.js',
        'test/test_cases/test_case_1/file_0_2.js',
        'test/test_cases/test_case_1/folder_1/file_1_1.js',
        'test/test_cases/test_case_1/folder_1/folder_1_1/file1_1_1.js',
        'test/test_cases/test_case_1/folder_2/folder_2_1/file_2_1_1.js',
        'test/test_cases/test_case_1/folder_2/folder_2_2/file_2_2_1.js' ];

      assert.deepEqual(
        angularDependency.listFiles('test/test_cases/test_case_1'),
        sampleFiles);
    });
  });

  describe('angularModules', function () {
    describe('modules', function () {
      it('should retrieve all the modules through the given path',
        function () {
          var files =
            angularDependency.listFiles('test/test_cases/test_case_2');
          var modules = {
            module1: {
              name: 'module1',
              defined: 'test/test_cases/test_case_2/file_0_1.js',
              dependencies: [],
              contents: []
            },
            module2: {
              name: 'module2',
              defined: 'test/test_cases/test_case_2/folder_1/file_1_1.js',
              dependencies: [],
              contents: []
            }
          };
          assert.deepEqual(
            modules, angularDependency.angularModules(files).modules);
        });

      it('should retrieve the module content and provide them to the object',
        function () {
          var files =
            angularDependency.listFiles('test/test_cases/test_case_3');
          var modules = {
            module1: {
              name: 'module1',
              defined: 'test/test_cases/test_case_3/file_0_2.js',
              dependencies: [],
              contents: [
                'test/test_cases/test_case_3/file_0_1.js',
                'test/test_cases/test_case_3/file_0_3.js']}};
          assert.deepEqual(
            modules, angularDependency.angularModules(files).modules);
        });

      it('should retrieve the module dependencies and provide them to the ' +
        'object', function () {
        var files =
          angularDependency.listFiles('test/test_cases/test_case_4');
        var modules = {
          module2: {
            name: 'module2',
            defined: 'test/test_cases/test_case_4/file_0_1.js',
            dependencies: [],
            contents: ['test/test_cases/test_case_4/file_0_4.js'] },
          module1: {
            name: 'module1',
            defined: 'test/test_cases/test_case_4/file_0_2.js',
            dependencies: [ 'module2' ],
            contents: [ 'test/test_cases/test_case_4/file_0_3.js' ]}};

        assert.deepEqual(
          modules, angularDependency.angularModules(files).modules);
      });

      it('should handle different kind of syntax', function () {
        var files =
          angularDependency.listFiles('test/test_cases/test_case_5');
        var modules = {
          module1: {
            name: 'module1',
            defined: 'test/test_cases/test_case_5/file_0_1.js',
            dependencies: [],
            contents: [ 'test/test_cases/test_case_5/file_0_2.js' ] },
          module2: {
            name: 'module2',
            defined: 'test/test_cases/test_case_5/file_0_1.js',
            dependencies: [ 'module3', 'module1' ],
            contents: [ 'test/test_cases/test_case_5/file_0_2.js' ] },
          module3: {
            name: 'module3',
            defined: 'test/test_cases/test_case_5/file_0_1.js',
            dependencies: [],
            contents: [ 'test/test_cases/test_case_5/file_0_2.js' ] } };

        assert.deepEqual(
          modules, angularDependency.angularModules(files).modules);
      });

      it('should be possible to get the dependency tree of a specific module',
        function () {
          var files =
            angularDependency.listFiles('test/test_cases/test_case_6');
          var modules = {
            name: 'module1',
            defined: 'test/test_cases/test_case_6/file_0_1.js',
            dependencies: [
              {
                name: 'module2',
                defined: 'test/test_cases/test_case_6/file_0_1.js',
                dependencies: [],
                contents: [] },
              {
                name: 'module3',
                defined: 'test/test_cases/test_case_6/file_0_1.js',
                dependencies: [
                  {
                    name: 'module4',
                    defined: 'test/test_cases/test_case_6/file_0_1.js',
                    dependencies: [],
                    contents: []
                  }],
                contents: []}],
            contents: []
          };
          assert.deepEqual(
            modules,
            angularDependency.angularModules(files).resolve('module1'));
        });

      it('should be possible to flatten this tree as a AngularModules object',
        function () {
          var files =
            angularDependency.listFiles('test/test_cases/test_case_6');
          var modules = [
            {
              name: 'module2',
              defined: 'test/test_cases/test_case_6/file_0_1.js',
              dependencies: [],
              contents: []
            }, {
              name: 'module4',
              defined: 'test/test_cases/test_case_6/file_0_1.js',
              dependencies: [],
              contents: []
            }, {
              name: 'module3',
              defined: 'test/test_cases/test_case_6/file_0_1.js',
              dependencies: [{
                name: 'module4',
                defined: 'test/test_cases/test_case_6/file_0_1.js',
                dependencies: [],
                contents: []
              }],
              contents: []
            }, {
              name: 'module1',
              defined: 'test/test_cases/test_case_6/file_0_1.js',
              dependencies: [{
                name: 'module2',
                defined: 'test/test_cases/test_case_6/file_0_1.js',
                dependencies: [],
                contents: []
              }, {
                name: 'module3',
                defined: 'test/test_cases/test_case_6/file_0_1.js',
                dependencies: [{
                  name: 'module4',
                  defined: 'test/test_cases/test_case_6/file_0_1.js',
                  dependencies: [],
                  contents: []
                }],
                contents: []
              }],
              contents: []
            }];

          assert.deepEqual(
            modules,
            angularDependency.angularModules(files).resolve('module1', true));
        });
    });

    describe('errors', function (){
      it('should throw an error if a module has not been defined', function () {
        var files =
          angularDependency.listFiles('test/test_cases/test_case_7');
        assert.throws(
          function() {
            angularDependency.angularModules(files);
          },
          angularDependency.NotDefined
        );
      });

      it('should throw an error if a module has already been defined',
        function () {
          var files =
            angularDependency.listFiles('test/test_cases/test_case_8');
          assert.throws(
            function() {
              angularDependency.angularModules(files);
            },
            angularDependency.AlreadyDefined
          );
        });

      it('should throw an error if a circular dependency exists',
        function () {
          var files =
            angularDependency.listFiles('test/test_cases/test_case_9');
          assert.throws(
            function() {
              angularDependency.angularModules(files).resolve('module1');
            },
            angularDependency.CircularDependency
          );
        });
    });
  });
});