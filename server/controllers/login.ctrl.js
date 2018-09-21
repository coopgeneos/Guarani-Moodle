const fs = require('fs')
const userController = require('./user.ctrl')

module.exports = {
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

  loginPageFailed: (req, res, next) => {
      res.send('Login Failed')
  },

  loginPageSuccess: (req, res, next) => {
      res.send('Login Success')
  },
}