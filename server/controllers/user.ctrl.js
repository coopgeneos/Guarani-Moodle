const fs = require('fs')
const I_User = require('./../models').I_User
const crypto = require('crypto')

module.exports = {
  addUser: (req, res, next) => {
    let newUser = req.body;
    newUser.password = crypto.createHash('md5').update(newUser.password).digest("hex");
    I_User.create(newUser)
        .then(user => {
            res.send("User saved!\n");  
        })
  },

  updateUser: (req, res, next) => {
    let newUser = req.body;
    newUser.password = crypto.createHash('md5').update(newUser.password).digest("hex");
    I_User.findById(req.params.id)
      .then(user => {
        user.name = newUser.name;
        user.surname = newUser.surname;
        user.username = newUser.username;
        user.password = newUser.password;
        user.role = newUser.role;
        user.save()
          .then(user => {
            res.send("User updated\n")
          })
          .catch(err => {
            res.send(err);
          })
      })
      .catch(err => {
        res.send(err);
      })
  },

  deleteUser: (req, res, next) => {
    I_User.findById(req.params.id)
      .then(user => {
        user.destroy()
          .then(user => {
            res.send('User deleted\n');
          })
          .catch(err => {
            res.send(err);
          })
      })
      .catch(err => {
        res.send(err);
      })
  },

  getById: (req, res, next) => {
  	I_User.findById(req.params.id)
  		.then(user => {
  			res.send(user);
  		})
  		.catch(err => {
  			res.send(err);
  		})
  },  

  getByUsername: (req, res, next) => {
    I_User.findOne({ where: {username: req.params.username} })
        .then(user => {
           res.send(user);
        })
  },

  getAll: (req, res, next) => {
  	I_User.findAll()
  		.then(users => {
    		res.send(users);
    	})
  },
}