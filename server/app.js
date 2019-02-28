/** require dependencies */
const path = require('path');
const express = require('express');
const routes = require('./routes/');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const router = express.Router()
const models = require('./models');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const I_User = require('./models/').I_User;
const crypto = require('crypto');
const cron = require('node-cron');
const Op = require('sequelize').Op;
const querystring = require('querystring');
const I_Config = require('./models/').I_Config;

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../src/config/config.json')[env];

const app = express();
let port = 5000;

// Configuración de la estrategia de Passport
passport.use(new LocalStrategy((username, password, done)  => {
    password = crypto.createHash('md5').update(password).digest("hex");
    I_User.findOne({ where: {username: username} })
        .then(user => {
        	if (user && user.password != password)  
            return done(null, false);
          return done(null, user)
        });
}));

passport.serializeUser(function(user, done) {
 	done(null, user.I_User_id);
});

passport.deserializeUser(function(id, done) {
	I_User.findOne({ where: {I_User_id: id} })
		.then(user => {
			done(null, user);
		});
});

/*
Dado que passport se usa en router, se debe inicializar alli junto
con la session
*/
//app.use(passport.initialize());
//app.use(passport.session());


/** set up middlewares */
/*
Cors se utiliza para habilitar Cross-origin resource sharing
Habilitar si se desea que los web services solo se puedan consultar desde un host determinado
*/
app.use(cors(
    ({
      credentials: true, 
      origin: config.urlClient
    })
  ))
/*
Morgan se utiliza para loggear los HTTP Request
Habilitar si se desea debuggear los request
*/
//app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(require('express-session')({ 
	secret: '4f5sef48sa6478d', 
	resave: false, 
	saveUninitialized: false 
}));
app.use(helmet())
app.use('/static',express.static(path.join(__dirname,'static')))

routes(router, passport);

app.use('/api', router);

app.listen(port, () => {
  //Croneo la tarea cada una hora
  I_Config.find({where: {key: 'CRON_PERIODICITY'}})
    .then(periodicity => {
      cron.schedule(periodicity.value, async () => {
        var now = new Date();
        console.info('\x1b[46m\x1b[30m%s\x1b[0m', `Iniciando sincronizaciones automaticas ${now}`);
        var I_Sync = require('./models/').I_Sync;
        var axios = require('axios');
        var I_Log = require('./models/').I_Log;   
        let syncs = await I_Sync.findAll({
            where: {
              task_from: {[Op.lt]: now},
              task_to: {[Op.gte]: now},
              task_next: {[Op.lte]: now.getHours()},
              task_periodicity: {[Op.ne]: 0},
            }
          })
          .catch((err) => {
            console.error(`====> ERROR al consultar las sincronizaciones a ejecutar ${err}`);
          });
        console.info(`Se tendrían que sincronizar ${syncs.length} I_Sync`);
        syncs.forEach(item => {
          axios.post(`http://127.0.0.1:${port}/api/syncUp/${item.I_Sync_id}`, querystring.stringify({secret:config.secretForSync}))
            .then(response => {
              // Habria que dejar log? no se pudo porque i_sincDetails es campo obligatorio
              var next = (item.task_next + item.task_periodicity) >= 24 ? (item.task_next + item.task_periodicity) - 24 : (item.task_next + item.task_periodicity);
              item.update({task_next: next})
                .catch(err => {
                  console.error(`====> ERROR al programar la siguiente sincronizacion {${item.I_Sync_id}} >>> ${err}`)
                });
            })
            .catch(err => {
              console.error(err);
            })
        });
      });
    })  
  .catch(err => {
      console.error(`====> ERROR al consultar la configuración de periodicidad: ${err}`);
    })

  console.info('\x1b[46m\x1b[30m%s\x1b[0m', `Server started at port: ${port}`);
})

