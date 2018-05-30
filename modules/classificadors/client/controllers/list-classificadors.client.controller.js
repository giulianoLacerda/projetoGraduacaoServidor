(function () {
  'use strict';

  angular
    .module('classificadors')
    .controller('ClassificadorsListController', ClassificadorsListController);

  ClassificadorsListController.$inject = ['ClassificadorsService'];

  function ClassificadorsListController(ClassificadorsService) {
    var vm = this;
    vm.classificadors = ClassificadorsService.query();

  }
})();
