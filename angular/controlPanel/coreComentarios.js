angular.module('MainApp', [])


function mainController($scope, $http) {
	$scope.newComentario = {};
	$scope.comentarios = {};
	$scope.selected = false;

	// Obtenemos todos los datos de la base de datos
	$http.get('/api/comentario').success(function(data) {
		$scope.comentarios = data;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});

	// Función para registrar a una comentario
	$scope.registrarComentario = function() {
		$http.post('/api/comentario', $scope.newComentario)
		.success(function(data) {
				$scope.newComentario = {}; // Borramos los datos del formulario
				$scope.comentarios = data;
			})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	// Función para editar los datos de una comentario
	$scope.modificarComentario = function(newComentario) {
		$http.put('/api/comentario/' + $scope.newComentario.id_comentario, $scope.newComentario)
		.success(function(data) {
				$scope.newComentario = {}; // Borramos los datos del formulario
				$scope.comentarios = data;
				$scope.selected = false;
			})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	// Función que borra una comentario conocido su id
	$scope.borrarComentario = function(newComentario) {
		$http.delete('/api/comentario/' + $scope.newComentario.id_comentario)
		.success(function(data) {
			$scope.newComentario = {};
			$scope.comentarios = data;
			$scope.selected = false;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	// Función para coger el objeto seleccionado en la tabla
	$scope.selectComentario = function(comentario) {
		$scope.newComentario = comentario;
		$scope.selected = true;
		console.log($scope.newComentario, $scope.selected);
	};
}