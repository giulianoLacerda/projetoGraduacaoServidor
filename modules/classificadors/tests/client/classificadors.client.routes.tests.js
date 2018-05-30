(function () {
  'use strict';

  describe('Classificadors Route Tests', function () {
    // Initialize global variables
    var $scope,
      ClassificadorsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ClassificadorsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ClassificadorsService = _ClassificadorsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('classificadors');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/classificadors');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ClassificadorsController,
          mockClassificador;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('classificadors.view');
          $templateCache.put('modules/classificadors/client/views/view-classificador.client.view.html', '');

          // create mock Classificador
          mockClassificador = new ClassificadorsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Classificador Name'
          });

          //Initialize Controller
          ClassificadorsController = $controller('ClassificadorsController as vm', {
            $scope: $scope,
            classificadorResolve: mockClassificador
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:classificadorId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.classificadorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            classificadorId: 1
          })).toEqual('/classificadors/1');
        }));

        it('should attach an Classificador to the controller scope', function () {
          expect($scope.vm.classificador._id).toBe(mockClassificador._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/classificadors/client/views/view-classificador.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ClassificadorsController,
          mockClassificador;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('classificadors.create');
          $templateCache.put('modules/classificadors/client/views/form-classificador.client.view.html', '');

          // create mock Classificador
          mockClassificador = new ClassificadorsService();

          //Initialize Controller
          ClassificadorsController = $controller('ClassificadorsController as vm', {
            $scope: $scope,
            classificadorResolve: mockClassificador
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.classificadorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/classificadors/create');
        }));

        it('should attach an Classificador to the controller scope', function () {
          expect($scope.vm.classificador._id).toBe(mockClassificador._id);
          expect($scope.vm.classificador._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/classificadors/client/views/form-classificador.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ClassificadorsController,
          mockClassificador;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('classificadors.edit');
          $templateCache.put('modules/classificadors/client/views/form-classificador.client.view.html', '');

          // create mock Classificador
          mockClassificador = new ClassificadorsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Classificador Name'
          });

          //Initialize Controller
          ClassificadorsController = $controller('ClassificadorsController as vm', {
            $scope: $scope,
            classificadorResolve: mockClassificador
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:classificadorId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.classificadorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            classificadorId: 1
          })).toEqual('/classificadors/1/edit');
        }));

        it('should attach an Classificador to the controller scope', function () {
          expect($scope.vm.classificador._id).toBe(mockClassificador._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/classificadors/client/views/form-classificador.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
