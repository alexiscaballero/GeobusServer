// Inicialización
var express  = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var app = module.exports = express();
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('./app/config');
//var app = express();
var port = 8888;

app.set('models', require('./app/models'));



var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  // configure stuff here
app.use(express.static(__dirname + '/angular'));
app.use(morgan('dev')); // activamos el log en modo 'dev'
app.use(bodyParser.json());
app.use(methodOverride('_method'));

require('./app/rutasPublicas.js')(app);

app.use('', router);
app.set('superSecret', config.secret);
}


//Filtro para proteger las llamadas a la API que necesitan autenticacion
router.use(function timeLog(req, res, next) {
 // check header or url parameters or post parameters for token
 var token = req.body.token || req.query.token || req.headers['x-access-token'];
 // decode token
 //console.log('token: ' + token);
 if (token) {
   // verifies secret and checks exp
   jwt.verify(token, app.get('superSecret'), function(err, decoded) {
     if (err) {
       return res.json({ success: false, message: 'Error al autenticar token.' });
     } else {
       // if everything is good, save to request for use in other routes
       req.decoded = decoded;
       next();
     }
   });
 } else {
   // if there is no token
   // return an error
   return res.status(403).send({
   	success: false,
   	message: 'No se envio ningun token.'
   });
 }
});

// Cargamos los endpoints
require('./app/rutas.js')(app);

// Cogemos el puerto para escuchar
app.listen(port);
console.log("Blog Corriendo En El Puerto " + port);
