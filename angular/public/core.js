"use strict";

var homeModule = angular.module("IndexModule",
	['app.home',
	'app.seccion',
	'app.contacto',
	'app.entrada',
	"ngRoute",
	"ui.router",
	'ngCookies'])
	.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;}]);

homeModule.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    	// If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
    	$urlRouterProvider.otherwise('/');
    	var app = {
      		name: 'app',
      		abstract: true,
      		url: '',
      		views: {
        		//'header': {
          		//	templateUrl: 'views/header.html',
        		//},
        	// '': {}, // skip in root state
        		'footer': {
          			templateUrl: 'views/footer.html'
        		}
        	}
		};
		$stateProvider.state(app);
  	}]);

homeModule.factory("UserService", function() {
  var seccionSeleccionada = {};
  var entradaSeleccionada = {};
  return {
    getSeccionSeleccionada: function() {
    	return seccionSeleccionada;
    },
    setSeccionSeleccionada: function(seccion) {
    	seccionSeleccionada = seccion;
    },
    getEntradaSeleccionada: function() {
    	return entradaSeleccionada;
    },
    setEntradaSeleccionada: function(entrada) {
    	entradaSeleccionada = entrada;
    }
  };
});

homeModule.controller("mainController",['$scope','$http','$state', '$cookies','UserService',

function mainController($scope, $http, $state, $cookies, UserService) {
	$scope.secciones = {};
	$scope.selected = false;

	// Obtenemos todas las secciones
	$http.get('/api/seccion').success(function(data) {
		//console.log(data);
		data = data.sort(function(a, b){return a.titulo_seccion.localeCompare(b.titulo_seccion)});
		$scope.secciones = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});

	// Función para obtener la seccion seleccionada
	$scope.selectSeccion = function(seccion) {
		console.log('Seccion Seleccionada: '+seccion.titulo_seccion);
		$scope.selected = true;
		UserService.setSeccionSeleccionada(seccion);
		$cookies.putObject('ultimaSeccionVisitada', seccion);
		$state.go('app.seccion', {}, {reload: true});
	};
}]);



