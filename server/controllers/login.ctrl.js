const I_User = require('./../models').I_User
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../src/config/config.json')[env];

module.exports = {
  /* Devuelve un formulario de login usado para testing */
  loginPage: (req, res, next) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
      <title>Page Title</title>
      </head>Users
      <body>
        <form action="http://localhost:5000/login" method="post">
          User name:<br>
          <input type="text" name="username"><br>
          User password:<br>
          <input type="password" name="password">
          <br><br>
          <input type="submit" value="Submit">
        </form> 
      </body>
      </html>
    `
    );
  },

  loginFailed: (req, res, next) => {
    let obj = { success: false, msg: "El par usuario y contraseña es incorrecto" };
    res.send(obj);   
  },

  ensureLoggedIn: (req, res, next) => {
    if (!req.isAuthenticated() && !req.body.secret && req.body.secret !== config.secretForSync) {
      res.sendStatus(401);
    } else {
      next();
    }
  },

  logout: (req, res, next) => {
    req.logout();
    let obj = { success: true, msg: "Logout correcto" };
    res.send(obj);
  }
}