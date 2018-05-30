(function () {
  'use strict';

  angular
      .module('classificadors')
      .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
        .state('classificadors', {
          abstract: true,
          url: '/classificadors',
          template: '<ui-view/>'
        })
        .state('classificadors.list', {
          url: '',
          templateUrl: 'modules/classificadors/client/views/list-classificadors.client.view.html',
          controller: 'ClassificadorsListController',
          controllerAs: 'vm',
          data: {
            pageTitle: 'Classificadors List'
          }
        })
        .state('classificadors.create', {
          url: '/create',
          templateUrl: 'modules/classificadors/client/views/form-classificador.client.view.html',
          controller: 'ClassificadorsController',
          controllerAs: 'vm',
          resolve: {
            classificadorResolve: newClassificador
          },
          data: {
            roles: ['user', 'admin'],
            pageTitle : 'Classificadors Create'
          }
        })
        .state('classificadors.edit', {
          url: '/:classificadorId/edit',
          templateUrl: 'modules/classificadors/client/views/form-classificador.client.view.html',
          controller: 'ClassificadorsController',
          controllerAs: 'vm',
          resolve: {
            classificadorResolve: getClassificador
          },
          data: {
            roles: ['user', 'admin'],
            pageTitle: 'Edit Classificador {{ classificadorResolve.name }}'
          }
        })
        .state('classificadors.view', {
          url: '/:classificadorId',
          templateUrl: 'modules/classificadors/client/views/view-classificador.client.view.html',
          controller: 'ClassificadorsController',
          controllerAs: 'vm',
          resolve: {
            classificadorResolve: getClassificador
          },
          data:{
            pageTitle: 'Classificador {{ articleResolve.name }}'
          }
        })
        .state('classificadors.view2', {
          url: '/:classificadorId',
          templateUrl: 'modules/classificadors/client/views/completa.html',
          controller: 'ClassificadorsController',
          controllerAs: 'vm',
          resolve: {
            classificadorResolve: getClassificador
          },
          data:{
            pageTitle: 'Classificador {{ articleResolve.name }}'
          }
        });
  }

  getClassificador.$inject = ['$stateParams', 'ClassificadorsService'];

  function getClassificador($stateParams, ClassificadorsService) {
    return ClassificadorsService.get({
      classificadorId: $stateParams.classificadorId
    }).$promise;
  }

  newClassificador.$inject = ['ClassificadorsService'];

  function newClassificador(ClassificadorsService) {
    return new ClassificadorsService();
  }
})();
