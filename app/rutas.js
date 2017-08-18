var Controller = require ('./controlador');

module.exports = function(app) {

  console.log("Acceso a rutas");
  app.post('/api/getTurnoActivo', Controller.getTurnoActivo);
  app.post('/api/getRecorridos', Controller.getRecorridos);
  app.post('/api/getRecorridoTurnoActivo', Controller.getRecorridoTurnoActivo);
  app.post('/api/getTrackColectivo', Controller.getTrackColectivo);
  app.post('/api/', Controller.getEmpty);
  app.post('/api/getColectivos', Controller.getColectivos);
  app.post('/api/getSucursales', Controller.getSucursales);
  app.post('/api/saveColectivo', Controller.saveColectivo);
  app.post('/api/updateColectivo', Controller.updateColectivo);
  app.post('/api/getChoferes', Controller.getChoferes);
  app.post('/api/saveChofer', Controller.saveChofer);
  app.post('/api/updatePersona', Controller.updatePersona);
  app.post('/api/getTurnos', Controller.getTurnos);
  app.post('/api/saveTurno', Controller.saveTurno);
  app.post('/api/updateTurno', Controller.updateTurno);
};
