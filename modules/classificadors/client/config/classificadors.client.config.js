(function () {
  'use strict';
  angular
    .module('classificadors')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Classificador',
      state: 'classificadors',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'classificadors', {
      title: 'Classificações',
      state: 'classificadors.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'classificadors', {
      title: 'Nova Classificação',
      state: 'classificadors.create',
      roles: ['admin']
    });
  }
})();
