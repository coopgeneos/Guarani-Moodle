const fs = require('fs')
const I_User = require('./../models').I_User
const crypto = require('crypto')

module.exports = {
  addUser: (req, res, next) => {
    let newUser = req.body;
    newUser.password = crypto.createHash('md5').update(newUser.password).digest("hex");
    I_User.create(newUser)
        .then(user => {
          let obj = {success: true, data: user};
          res.send(obj);
        })
        .catch(err => {
          let obj = {success: false, msg: "Hubo un error al crear el usuario"};
          res.send(obj);
        })
  },

  updateUser: (req, res, next) => {
    let newUser = req.body;
    newUser.password = crypto.createHash('md5').update(newUser.password).digest("hex");
    I_User.findById(req.params.id)
      .then(user => {
        user.name = newUser.name;
        if(newUser.surname) 
          user.surname = newUser.surname
        user.surname = newUser.surname ? newUser.surname : user.surname;
        user.username = newUser.username;
        user.password = newUser.password;
        user.role = newUser.role;
        user.save()
          .then(user => {
            let obj = {success: true, data: user};
            res.send(obj);
          })
          .catch(err => {
            let obj = {success: false, msg: "Hubo un error al actualizar el usuario"};
            res.send(obj);
          })
      })
      .catch(err => {
        let obj = {success: false, msg: "El usuario no existe"};
        res.send(obj);
      })
  },

  deleteUser: (req, res, next) => {
    I_User.findById(req.params.id)
      .then(user => {
        user.destroy()
          .then(user => {
            let obj = {success: true, msg: "El usuario se eliminó correctamente"};
            res.send(obj);
          })
          .catch(err => {
            let obj = {success: false, msg: "El usuario no se pudo eliminar"};
            res.send(obj);
          })
      })
      .catch(err => {
        let obj = {success: false, msg: "El usuario no existe"};
        res.send(obj);
      })
  },

  getById: (req, res, next) => {
  	I_User.findById(req.params.id)
  		.then(user => {
  			let obj = {success: true, data: user};
        res.send(obj);
  		})
  		.catch(err => {
  			let obj = {success: false, msg: "El usuario no existe"};
        res.send(obj);
  		})
  },  

  getByUsername: (req, res, next) => {
    I_User.findOne({ where: {username: req.params.username} })
        .then(user => {
          let obj = {success: true, data: user};
          res.send(obj);
        })
        .catch(err => {
          let obj = {success: false, msg: "El usuario no existe"};
          res.send(obj);
        })
  },

  getAll: (req, res, next) => {
  	I_User.findAll()
  		.then(users => {
    		let obj = {success: true, data: users};
        res.send(obj);
    	})
      .catch(err => {
        let obj = {success: false, msg: "Hubo un error al consultar los usuarios"};
        res.send(obj);
      })
  },
}