var Controller = require ('./controlador');

module.exports = function(app) {

	console.log("Acceso a rutas publicas");
	//Autenticacion
	app.post('/api/authenticate', Controller.authenticate);
	//Otras llamadas publicas a la API
	//Prueba
	app.get('/api/getCiudades', Controller.getCiudades);

	app.get('/api/hola', Controller.getHola);

	app.post('/api/getClientes', Controller.getClientes);

	app.post('/api/savePedidos', Controller.savePedidos);
};
