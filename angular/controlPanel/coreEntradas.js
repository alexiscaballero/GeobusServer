angular.module('MainApp', [])


function mainController($scope, $http) {
	$scope.newEntrada = {};
	$scope.entradas = {};
	$scope.selected = false;

	// Obtenemos todos los datos de la base de datos
	$http.get('/api/entrada').success(function(data) {
		$scope.entradas = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});

	// Función para registrar a una entrada
	$scope.registrarEntrada = function() {
		$http.post('/api/entrada', $scope.newEntrada)
		.success(function(data) {
				$scope.newEntrada = {}; // Borramos los datos del formulario
				$scope.entradas = data;
			})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	// Función para editar los datos de una entrada
	$scope.modificarEntrada = function(newEntrada) {
		$http.put('/api/entrada/' + $scope.newEntrada.id_entrada, $scope.newEntrada)
		.success(function(data) {
				$scope.newEntrada = {}; // Borramos los datos del formulario
				$scope.entradas = data;
				$scope.selected = false;
			})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	// Función que borra una entrada conocido su id
	$scope.borrarEntrada = function(newEntrada) {
		$http.delete('/api/entrada/' + $scope.newEntrada.id_entrada)
		.success(function(data) {
			$scope.newEntrada = {};
			$scope.entradas = data;
			$scope.selected = false;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	// Función para coger el objeto seleccionado en la tabla
	$scope.selectEntrada = function(entrada) {
		$scope.newEntrada = entrada;
		$scope.selected = true;
		console.log($scope.newEntrada, $scope.selected);
	};
}