(function () {
  'use strict';

  describe('Avaliacoes List Controller Tests', function () {
    // Initialize global variables
    var AvaliacoesListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      AvaliacoesService,
      mockAvaliacoe;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _AvaliacoesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      AvaliacoesService = _AvaliacoesService_;

      // create mock article
      mockAvaliacoe = new AvaliacoesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Avaliacoe Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Avaliacoes List controller.
      AvaliacoesListController = $controller('AvaliacoesListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockAvaliacoeList;

      beforeEach(function () {
        mockAvaliacoeList = [mockAvaliacoe, mockAvaliacoe];
      });

      it('should send a GET request and return all Avaliacoes', inject(function (AvaliacoesService) {
        // Set POST response
        $httpBackend.expectGET('api/avaliacoes').respond(mockAvaliacoeList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.avaliacoes.length).toEqual(2);
        expect($scope.vm.avaliacoes[0]).toEqual(mockAvaliacoe);
        expect($scope.vm.avaliacoes[1]).toEqual(mockAvaliacoe);

      }));
    });
  });
}());
