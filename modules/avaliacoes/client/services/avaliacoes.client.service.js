// Avaliacoes service used to communicate Avaliacoes REST endpoints
(function () {
  'use strict';

  angular
    .module('avaliacoes')
    .factory('AvaliacoesService', AvaliacoesService);

  AvaliacoesService.$inject = ['$resource'];

  function AvaliacoesService($resource) {
    return $resource('api/avaliacoes/:avaliacoeId', {
      avaliacoeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
