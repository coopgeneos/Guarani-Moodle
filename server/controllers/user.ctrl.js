const fs = require('fs')
const I_User = require('./../models').I_User
const crypto = require('crypto')

module.exports = {
    addUser: (req, res, next) => {
        console.log("Ejecutando User.addUser");
        let newUser = req.body;
        newUser.password = crypto.createHash('md5').update(newUser.password).digest("hex");
        I_User.create(newUser)
            .then(user => {
                res.send("User saved!\n");  
            })
    },

    getById: (req, res, next) => {
    	console.log("Ejecutando User.getById con "+req.param('id')+" "+req.params.id);
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
    	console.log("Ejecutando User.getAll");
    	I_User.findAll()
    		.then(users => {
	    		res.send(users);
	    	})
    },
}