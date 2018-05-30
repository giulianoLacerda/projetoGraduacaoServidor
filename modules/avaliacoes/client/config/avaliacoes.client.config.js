(function () {
    'use strict';

    angular
        .module('avaliacoes')
        .run(menuConfig);

    menuConfig.$inject = ['Menus'];

    function menuConfig(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', {
            title: 'Avaliação',
            state: 'avaliacoes',
            type: 'dropdown',
            roles: ['user']
        });

        // Add the dropdown list item
        Menus.addSubMenuItem('topbar', 'avaliacoes', {
            title: 'Avaliações',
            state: 'avaliacoes.list'
        });

        // Add the dropdown create item
        Menus.addSubMenuItem('topbar', 'avaliacoes', {
            title: 'Nova Avaliação',
            state: 'avaliacoes.create',
            roles: ['user']
        });
    }
}());
