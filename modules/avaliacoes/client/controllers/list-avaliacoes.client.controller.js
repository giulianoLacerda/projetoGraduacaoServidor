(function () {
  'use strict';

  angular
    .module('avaliacoes')
    .controller('AvaliacoesListController', AvaliacoesListController);

  AvaliacoesListController.$inject = ['AvaliacoesService'];

  function AvaliacoesListController(AvaliacoesService) {
    var vm = this;

    vm.avaliacoes = AvaliacoesService.query();
  }
}());
