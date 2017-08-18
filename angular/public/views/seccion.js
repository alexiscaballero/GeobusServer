'use strict';

var moduloSeccion = angular
  .module('app.seccion', [
    'ngRoute',
    'ui.router',
    'ngCookies',
  ])
  .config(['$stateProvider', function($stateProvider) {

      var settings = {
          name: 'app.seccion',
          //abstract: true,
          url: '/seccion',
          views: {
            '@': {
              templateUrl: 'views/seccion.html',
              controller: 'seccionController'
            }
          }
      };

      $stateProvider.state(settings);

  }])
  .controller("seccionController",['$scope','$http','$cookies','$state','UserService',
  function seccionController($scope, $http, $cookies, $state, UserService) {
    
    if (Object.keys(UserService.getSeccionSeleccionada()).length==0) {
      console.log('No hay ninguna seccion seleccionada :(');
      var ultimaSeccion = $cookies.getObject('ultimaSeccionVisitada');
      UserService.setSeccionSeleccionada(ultimaSeccion);
    };
    $scope.seccionSeleccionada = UserService.getSeccionSeleccionada();
    $scope.entradas = {};
    $scope.selected = false;
    
    //console.log(UserService.getSeccionSeleccionada().titulo_seccion);
    // Obtenemos todas las entradas de la seccion seleccionada
    $http.get('/api/entrada/'+UserService.getSeccionSeleccionada().id_seccion).success(function(entradas) {
      console.log(entradas);
      entradas = entradas.sort(function(a, b){return a.createdAt.localeCompare(b.createdAt)});
      $scope.entradas = entradas;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

      // Función para obtener la entrada seleccionada
  $scope.selectEntrada = function(entrada) {
    console.log('Entrada Seleccionada: '+entrada.titulo_entrada);
    $scope.selected = true;
    UserService.setEntradaSeleccionada(entrada);
    $cookies.putObject('ultimaEntradaVisitada', entrada);
    $state.go('app.entrada', {}, {reload: true});
  };
}]);

