const I_SyncCategory = require('./../models').I_SyncCategory

module.exports = {
	create: (req, res, next) => {
		let newSC = req.body;   
		I_SyncCategory.create(newSC)
			.then(sCat => {
				let obj = {success: true, msg: "Categoría creada"};
        res.send(obj);
			})
			.catch(err => {
				console.log(err);
				let obj = {success: false, msg: "Hubo un error al crear la categoría"};
        res.send(obj);
			})  	
	},

	update: (req, res, next) => {
		let catToUpdate = req.body;
    I_SyncCategory.findById(req.params.id)
      .then(categ => {
      	categ.name = catToUpdate.name ? catToUpdate.name : categ.name;
      	categ.mdl_category_id = catToUpdate.mdl_category_id ? catToUpdate.mdl_category_id : categ.mdl_category_id;
      	categ.save()
      		.then(updated => {
      			let obj = {success: true, msg: "Categoría actualizada"};
        		res.send(obj);
      		})
      		.catch(err => {
      			let obj = {success: false, msg: "Hubo un error al actualizar la categoría"};
        		res.send(obj);
      		})
      })
      .catch(err => {
      	let obj = {success: false, msg: "No existe la categoría que desea actualizar"};
        res.send(obj);
      })
	},

	findById: (req, res, next) => {
		I_SyncCategory.findById(req.params.id)
      .then(categ => {
        let obj = {success:true, data: categ};
        res.send(obj);
      })
      .catch(err => {
        let obj = {success:false, msg: "La categoría solicitada no existe"};
        res.send(obj);
      })
	},

	findAll: (req, res, next) => {
		I_SyncCategory.findAll({where: req.query,
                    attributes: {exclude: ['createdAt', 'updatedAt']}
                  })
      .then(categs => {
        let obj = {success: true, data: categs};
        res.send(obj);
      })
      .catch(err => {
        let obj = {success: false, msg: "Alguno de los parámetros tiene un nombre o valor incorrecto"}
        res.send(obj);
      })
	},

}