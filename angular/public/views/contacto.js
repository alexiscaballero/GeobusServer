'use strict';

var moduloContacto = angular
  .module('app.contacto', [
    'ngRoute',
    'ui.router',
    'ngCookies',
  ])
  .config(['$stateProvider', function($stateProvider) {

      var settings = {
          name: 'app.contacto',
          //abstract: true,
          url: '/contacto',
          views: {
            '@': {
              templateUrl: 'views/contacto.html',
              controller: 'contactoController'
            }
          }
      };

      $stateProvider.state(settings);

  }])
  .controller("contactoController",['$scope','$http','$cookies','UserService',
  function seccionController($scope, $http, $cookies, UserService) {
}]);

