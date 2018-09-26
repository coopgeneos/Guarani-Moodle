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
//app.use(cors())
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

app.use('/', router)

/** start server */
app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
})

