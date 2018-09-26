const I_User = require('./../models').I_User

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
<<<<<<< 4040b6126468dca03fc97fe08aaa31833435ef6d
    //res.json({ success: 'false', msg: 'El par usuario y contraseña es incorrecto' });
    res.send('{ "success": "false", "msg": "El par usuario y contraseña es incorrecto" }');
=======
    res.json({ success: false, msg: 'El par usuario y contraseña es incorrecto' });
    res.send();
>>>>>>> backend-frontend integration for Login action
  },

  ensureLoggedIn: (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.sendStatus(401);
    } else {
      next();
    }
  },

  logout: (req, res, next) => {
    req.logout();
    res.send('{ "success": "true", "msg": "Logout correcto" }');
  }
}