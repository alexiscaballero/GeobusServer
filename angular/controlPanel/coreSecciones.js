angular.module('MainApp', [])


function mainController($scope, $http) {
	$scope.newSeccion = {};
	$scope.secciones = {};
	$scope.selected = false;

	// Obtenemos todos los datos de la base de datos
	$http.get('/api/seccion').success(function(data) {
		$scope.secciones = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});

	// Función para registrar a una seccion
	$scope.registrarSeccion = function() {
		$http.post('/api/seccion', $scope.newSeccion)
		.success(function(data) {
				$scope.newSeccion = {}; // Borramos los datos del formulario
				$scope.secciones = data;
			})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	// Función para editar los datos de una seccion
	$scope.modificarSeccion = function(newSeccion) {
		$http.put('/api/seccion/' + $scope.newSeccion.id_seccion, $scope.newSeccion)
		.success(function(data) {
				$scope.newSeccion = {}; // Borramos los datos del formulario
				$scope.secciones = data;
				$scope.selected = false;
			})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	// Función que borra una seccion conocido su id
	$scope.borrarSeccion = function(newSeccion) {
		$http.delete('/api/seccion/' + $scope.newSeccion.id_seccion)
		.success(function(data) {
			$scope.newSeccion = {};
			$scope.secciones = data;
			$scope.selected = false;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	// Función para coger el objeto seleccionado en la tabla
	$scope.selectSeccion = function(seccion) {
		$scope.newSeccion = seccion;
		$scope.selected = true;
		console.log($scope.newSeccion, $scope.selected);
	};
}