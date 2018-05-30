(function () {
  'use strict';

  describe('Avaliacoes Route Tests', function () {
    // Initialize global variables
    var $scope,
      AvaliacoesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AvaliacoesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AvaliacoesService = _AvaliacoesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('avaliacoes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/avaliacoes');
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
          AvaliacoesController,
          mockAvaliacoe;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('avaliacoes.view');
          $templateCache.put('modules/avaliacoes/client/views/view-avaliacoe.client.view.html', '');

          // create mock Avaliacoe
          mockAvaliacoe = new AvaliacoesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Avaliacoe Name'
          });

          // Initialize Controller
          AvaliacoesController = $controller('AvaliacoesController as vm', {
            $scope: $scope,
            avaliacoeResolve: mockAvaliacoe
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:avaliacoeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.avaliacoeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            avaliacoeId: 1
          })).toEqual('/avaliacoes/1');
        }));

        it('should attach an Avaliacoe to the controller scope', function () {
          expect($scope.vm.avaliacoe._id).toBe(mockAvaliacoe._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/avaliacoes/client/views/view-avaliacoe.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AvaliacoesController,
          mockAvaliacoe;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('avaliacoes.create');
          $templateCache.put('modules/avaliacoes/client/views/form-avaliacoe.client.view.html', '');

          // create mock Avaliacoe
          mockAvaliacoe = new AvaliacoesService();

          // Initialize Controller
          AvaliacoesController = $controller('AvaliacoesController as vm', {
            $scope: $scope,
            avaliacoeResolve: mockAvaliacoe
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.avaliacoeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/avaliacoes/create');
        }));

        it('should attach an Avaliacoe to the controller scope', function () {
          expect($scope.vm.avaliacoe._id).toBe(mockAvaliacoe._id);
          expect($scope.vm.avaliacoe._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/avaliacoes/client/views/form-avaliacoe.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AvaliacoesController,
          mockAvaliacoe;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('avaliacoes.edit');
          $templateCache.put('modules/avaliacoes/client/views/form-avaliacoe.client.view.html', '');

          // create mock Avaliacoe
          mockAvaliacoe = new AvaliacoesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Avaliacoe Name'
          });

          // Initialize Controller
          AvaliacoesController = $controller('AvaliacoesController as vm', {
            $scope: $scope,
            avaliacoeResolve: mockAvaliacoe
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:avaliacoeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.avaliacoeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            avaliacoeId: 1
          })).toEqual('/avaliacoes/1/edit');
        }));

        it('should attach an Avaliacoe to the controller scope', function () {
          expect($scope.vm.avaliacoe._id).toBe(mockAvaliacoe._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/avaliacoes/client/views/form-avaliacoe.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
