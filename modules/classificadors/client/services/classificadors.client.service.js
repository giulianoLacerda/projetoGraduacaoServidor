//Classificadors service used to communicate Classificadors REST endpoints
(function () {
  'use strict';

  angular
    .module('classificadors')
    .factory('ClassificadorsService', ClassificadorsService);

  ClassificadorsService.$inject = ['$resource'];

  function ClassificadorsService($resource) {
    return $resource('api/classificadors/:classificadorId', {
      classificadorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
