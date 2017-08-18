'use strict';

angular
  .module('app.home', [
    'ngRoute',
    'ui.router'
  ])
  .config(['$stateProvider', function($stateProvider) {

      var home = {
          name: 'app.home',
          url: '/',
          views: {
            '@': {
              templateUrl: 'views/home.html',
            }
          }
      };

      $stateProvider.state(home);

  }]);