(function () {
    'use strict';

    angular
        .module('avaliacoes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
            .state('avaliacoes', {
                abstract: true,
                url: '/avaliacoes',
                template: '<ui-view/>'
            })
            .state('avaliacoes.list', {
                url: '',
                templateUrl: 'modules/avaliacoes/client/views/list-avaliacoes.client.view.html',
                controller: 'AvaliacoesListController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Avaliacoes List'
                }
            })
            .state('avaliacoes.create', {
                url: '/create',
                templateUrl: 'modules/avaliacoes/client/views/form-avaliacoe.client.view.html',
                controller: 'AvaliacoesController',
                controllerAs: 'vm',
                resolve: {
                    avaliacoeResolve: newAvaliacoe
                },
                data: {
                    roles: ['user', 'admin'],
                    pageTitle: 'Avaliacoes Create'
                }
            })
            .state('avaliacoes.createi', {
                url: '/create',
                templateUrl: 'modules/avaliacoes/client/views/form-image-avaliacoe.client.view.html',
                controller: 'AvaliacoesController',
                controllerAs: 'vm',
                resolve: {
                    avaliacoeResolve: newAvaliacoe
                },
                data: {
                    roles: ['user', 'admin'],
                    pageTitle: 'Avaliacoes Create'
                }
            })
            .state('avaliacoes.edit', {
                url: '/:avaliacoeId/edit',
                templateUrl: 'modules/avaliacoes/client/views/form-avaliacoe.client.view.html',
                controller: 'AvaliacoesController',
                controllerAs: 'vm',
                resolve: {
                    avaliacoeResolve: getAvaliacoe
                },
                data: {
                    roles: ['user', 'admin'],
                    pageTitle: 'Edit Avaliacoe {{ avaliacoeResolve.name }}'
                }
            })
            .state('avaliacoes.editi', {
                url: '/:avaliacoeId/editi',
                templateUrl: 'modules/avaliacoes/client/views/form-image-avaliacoe.client.view.html',
                controller: 'AvaliacoesController',
                controllerAs: 'vm',
                resolve: {
                    avaliacoeResolve: getAvaliacoe
                },
                data: {
                    roles: ['user', 'admin'],
                    pageTitle: 'Edit Avaliacoe {{ avaliacoeResolve.name }}'
                }
            })
            .state('avaliacoes.view', {
                url: '/:avaliacoeId',
                templateUrl: 'modules/avaliacoes/client/views/view-avaliacoe.client.view.html',
                controller: 'AvaliacoesController',
                controllerAs: 'vm',
                resolve: {
                    avaliacoeResolve: getAvaliacoe
                },
                data: {
                    pageTitle: 'Avaliacoe {{ avaliacoeResolve.name }}'
                }
            });
    }

    getAvaliacoe.$inject = ['$stateParams', 'AvaliacoesService'];

    function getAvaliacoe($stateParams, AvaliacoesService) {
        return AvaliacoesService.get({
            avaliacoeId: $stateParams.avaliacoeId
        }).$promise;
    }

    newAvaliacoe.$inject = ['AvaliacoesService'];

    function newAvaliacoe(AvaliacoesService) {
        return new AvaliacoesService();
    }
}());
