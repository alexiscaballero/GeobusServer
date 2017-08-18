var app = require('../server');
var seq = app.get('models').sequelize;
var jwt = require('jsonwebtoken');

// http://docs.sequelizejs.com/en/v3/docs/querying/


/******************* New Model ****************/
var Ciudades = app.get('models').ciudad;
var Colectivo = app.get('models').colectivo;
var Empresa = app.get('models').empresa;
var Funciones = app.get('models').funciones;
var Permisos = app.get('models').permisos;
var Persona = app.get('models').persona;
var Recorrido = app.get('models').recorrido;
var Rol = app.get('models').rol;
var Segmento = app.get('models').segmento;
var Sucursal = app.get('models').sucursal;
var Track = app.get('models').track;
var Turno = app.get('models').turno;
var Ubicacion = app.get('models').ubicacion;
var Usuario = app.get('models').usuario;


exports.getClientes = function (req, res) {
  console.log(req.body);
  res.write('{clientes: [{"id":"1","nombre":"Alexis Caballero"}, {"id":"2","nombre":"Federico Romani"}, {"id":"3","nombre":"Juan Topo"}, {"id":"4","nombre":"Algun Cliente"}]}');
  res.end();
}

exports.savePedidos = function (req, res) {
  console.log(req.body);
  //res.write('{"estado": "1", "mensaje": "ok"}');
  res.write('{"estado": "0", "mensaje": "Ocurrió un error inesperado."}');
  res.end();
}

//Prueba
exports.getHola = function (req, res) {
  console.log("llamada al metodo hola");
  res.write('HOLA MUNDO!');
  res.end();
}

/**************  CRUD entity Ciudades ********/
exports.getCiudades = function (req, res){
    Ciudades.findAll({}).then(function(todasCiudades) {
   	  res.json(todasCiudades);
	});
}


exports.setCiudad = function (req, res){
	Ciudades.findAll({}).then(function() {
    	res.json(todasLasSecciones);
	});
}

//Autenticacion
exports.authenticate = function (req, res) {
  // find the user
  seq.query('SELECT * FROM usuarios WHERE usuario = :usuario ',
    { replacements: { usuario: req.body.usuario }, type: seq.QueryTypes.SELECT })
    .then(
      function(resUsuarios) {
        var usuario = resUsuarios[0];
        console.log(usuario);   
         if (!usuario) {
          res.json({ success: false, message: 'La Autenticacion Fallo. Usuario No Encontrado.' });
        } else if (usuario) {
          // check if password matches
          if (usuario.clave != req.body.clave) {
            res.json({ success: false, message: 'La Autenticacion Fallo. Contraseña Erronea.' });
          } else {
            // if user is found and password is right
            // create a token
            var token = jwt.sign(usuario, app.get('superSecret'), {
              expiresIn: 24*3600 // expires in 24 hours
            });
            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token
            });
          }
        }
      }
  );
}

exports.getTurnoActivo = function(req, res) {
  var time = new Date();
  var formattedHour = ("0" + time.getHours()).slice(-2)   + ":" + 
                      ("0" + time.getMinutes()).slice(-2) + ":" + 
                      ("0" + time.getSeconds()).slice(-2);
  seq.query('SELECT * FROM turnos WHERE "horaInicio" <= time :horap AND "horaFin" >= time :horap AND recorrido_fk = :recorridop',
    { replacements: { horap: formattedHour, recorridop: req.body.recorrido }, type: seq.QueryTypes.SELECT })
  .then(function(turnos) {
    res.json({
              success: true,
              turno: turnos[0]
            });
  });
}

exports.getRecorridos = function (req, res){
  Recorrido.findAll({}).then(function(todosLosRecorridos) {
      res.json({
        success: true,
        recorridos: todosLosRecorridos
      });
  });
}

exports.getRecorridoTurnoActivo = function(req, res) {
  var time = new Date();
  var formattedHour = ("0" + time.getHours()).slice(-2)   + ":" + 
                      ("0" + time.getMinutes()).slice(-2) + ":" + 
                      ("0" + time.getSeconds()).slice(-2);
  seq.query('SELECT segmento."idSegmento", "ubicacionInicio_fk" AS idUbicacion, latitud, longitud, parada FROM turnos, segmento, ubicacion WHERE "horaInicio" <= time :horap AND "horaFin" >= time :horap AND turnos.recorrido_fk = :recorridop AND turnos.recorrido_fk = segmento.recorrido_fk AND "ubicacionInicio_fk" = "idUbicacion" UNION SELECT segmento."idSegmento", ubicacionFin_fk AS idUbicacion, latitud, longitud, parada FROM turnos, segmento, ubicacion WHERE "horaInicio" <= time :horap AND "horaFin" >= time :horap AND turnos.recorrido_fk = :recorridop AND turnos.recorrido_fk = segmento.recorrido_fk AND ubicacionFin_fk = "idUbicacion"',
    { replacements: { horap: formattedHour, recorridop: req.body.recorrido }, type: seq.QueryTypes.SELECT })
  .then(function(segmentos) {
    res.json({
              success: true,
              segmentos: segmentos
            });
  });
}

exports.getTrackColectivo = function(req, res) {
  seq.query('SELECT "idColectivo", patente, marca, "idTrack", fecha, hora, latitud, longitud, velocidad FROM turnos, colectivos, track WHERE turnos."idTurno" = track.turno_fk AND turnos.colectivo_fk = colectivos."idColectivo" AND turnos.recorrido_fk = :recorridop ORDER BY fecha DESC, hora DESC LIMIT 1',
    { replacements: { recorridop: req.body.recorrido }, type: seq.QueryTypes.SELECT })
    .then(function(lastTrack) {
      console.log(lastTrack);
      res.json({
        success: true,
        track: lastTrack[0]
      });
    });
}

exports.getEmpty = function(req, res) {
  res.json({
    success: true
  });
}

exports.getColectivos = function(req, res) {
  seq.query('SELECT "idColectivo", patente, modelo, marca, sucursal_fk as idSucursal FROM colectivos',
    { replacements: { }, type: seq.QueryTypes.SELECT })
    .then(function(listaColectivos) {
      res.json({
        success: true,
        colectivos: listaColectivos
      });
    });
}

exports.getSucursales = function(req, res) {
  seq.query('SELECT "idSucursal", direccion, descripcion, ciudad_fk as idCiudad, empresa_fk as idEmpresa FROM sucursal',
    { replacements: { }, type: seq.QueryTypes.SELECT })
    .then(function(listaSucursales) {
      res.json({
        success: true,
        sucursales: listaSucursales
      });
    });
}

exports.saveColectivo = function(req, res) {
  Colectivo.create({
        patente: req.body.patente,
        modelo: req.body.modelo,
        marca: req.body.marca,
        sucursal_fk: req.body.idSucursal
      }).then(function(comentario) {
        res.json({
          success: true
        });
      });
}

exports.updateColectivo = function(req, res){
  Colectivo.find({
      where: {
        idColectivo: req.body.idColectivo
      }
    }).then(function(colectivo) {
        if (colectivo) {
          colectivo.updateAttributes({
            patente: req.body.patente,
            modelo: req.body.modelo,
            marca: req.body.marca,
            sucursal_fk: req.body.idSucursal
          }).then(function(colectivo) {
            res.json({
              success: true
            });   
          });
        } else {
          res.json({
            success: false
          });
        };
    });
}

exports.getChoferes = function(req, res) {
  seq.query('SELECT * FROM  usuarios, personas, rol WHERE  usuarios."idRol" = rol."idRol" AND  usuarios."idPersona" = personas."idPersona" AND  rol.descripcion = \'CHOFER\'',
    { replacements: { }, type: seq.QueryTypes.SELECT })
    .then(function(listaChoferes) {
      res.json({
        success: true,
        choferes: listaChoferes
      });
    });
}

exports.saveChofer = function(req, res) {
  Persona.create({
        dni: req.body.dni,
        nombre: req.body.nombre
      }).then(function(persona) {
        Usuario.create({
          usuario: req.body.usuario,
          clave: 123,
          idPersona: persona.idPersona,
          idRol: 2
        }).then(function(usuario) {
          res.json({
              success: true
          });
        });  
      });
}

exports.updatePersona = function(req, res){
  Persona.find({
      where: {
        idPersona: req.body.idPersona
      }
    }).then(function(persona) {
        if (persona) {
          persona.updateAttributes({
            dni: req.body.dni,
            nombre: req.body.nombre
          }).then(function(persona) {
            res.json({
              success: true
            });   
          });
        } else {
          res.json({
            success: false
          });
        };
    });
}

exports.getTurnos = function(req, res) {
  seq.query('SELECT "idTurno", "horaInicio", "horaFin", colectivo_fk "idColectivo", modelo, patente, recorrido_fk "idRecorrido", usuario_fk "idUsuario", nombre chofer, ramal FROM turnos, usuarios, personas, colectivos, recorridos WHERE turnos.usuario_fk = usuarios.id and personas."idPersona" = usuarios."idPersona" and turnos.colectivo_fk = colectivos."idColectivo" and turnos.recorrido_fk = recorridos."idRecorrido"',
    { replacements: { }, type: seq.QueryTypes.SELECT })
    .then(function(listaTurnos) {
      res.json({
        success: true,
        turnos: listaTurnos
      });
    });
}

exports.saveTurno = function(req, res) {
  seq.query('INSERT INTO "turnos" ("horaInicio","horaFin","colectivo_fk","recorrido_fk","usuario_fk") VALUES (time :horaInicio, time :horaFin, :pColectivo, :pRecorrido, :pUsuario)',
    { replacements: { horaInicio: req.body.horaInicio, horaFin: req.body.horaFin, pColectivo: req.body.idColectivo, pRecorrido: req.body.idRecorrido, pUsuario: req.body.idUsuario}, type: seq.QueryTypes.SELECT })
    .then(function(turno) {
        res.json({
              success: true
          });  
      });
}

exports.updateTurno = function(req, res) {
  console.log('GUARDANDO TURNO!..');
  seq.query('UPDATE turnos SET "horaInicio"= time :horaInicio, "horaFin"= time :horaFin, colectivo_fk= :pColectivo, recorrido_fk= :pRecorrido, usuario_fk= :pUsuario WHERE "idTurno" = :pIdTurno',
    { replacements: { horaInicio: req.body.horaInicio, horaFin: req.body.horaFin, pColectivo: req.body.idColectivo, pRecorrido: req.body.idRecorrido, pUsuario: req.body.idUsuario, pIdTurno: req.body.idTurno}, type: seq.QueryTypes.SELECT })
    .then(function(turno) {
        res.json({
              success: true
          });  
      });
}