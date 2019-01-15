const I_SyncCohort = require('../models').I_SyncCohort

module.exports = {
	create: (req, res, next) => {
		let newC = req.body;   
		I_SyncCohort.create(newC)
			.then(sCoh => {
				let obj = {success: true, msg: "Cohorte creado"};
        res.send(obj);
			})
			.catch(err => {
				console.log(err);
				let obj = {success: false, msg: "Hubo un error al crear el cohorte"};
        res.send(obj);
			})  	
	},

	update: (req, res, next) => {
		let toUpdate = req.body;
    I_SyncCohort.findById(req.params.id)
      .then(cohort => {
      	cohort.name = toUpdate.name ? toUpdate.name : cohort.name;
      	cohort.mdl_cohort_id = toUpdate.mdl_cohort_id ? toUpdate.mdl_cohort_id : cohort.mdl_cohort_id;
      	cohort.save()
      		.then(updated => {
      			let obj = {success: true, msg: "Cohorte actualizado"};
        		res.send(obj);
      		})
      		.catch(err => {
      			let obj = {success: false, msg: "Hubo un error al actualizar el cohorte"};
        		res.send(obj);
      		})
      })
      .catch(err => {
      	let obj = {success: false, msg: "No existe la cohorte que desea actualizar"};
        res.send(obj);
      })
	},

	findById: (req, res, next) => {
		I_SyncCohort.findById(req.params.id)
      .then(cohort => {
        let obj = {success:true, data: cohort};
        res.send(obj);
      })
      .catch(err => {
        let obj = {success:false, msg: "El cohorte solicitado no existe"};
        res.send(obj);
      })
	},

	findAll: (req, res, next) => {
		I_SyncCohort.findAll({where: req.query,
                    attributes: {exclude: ['createdAt', 'updatedAt']}
                  })
      .then(cohorts => {
        let obj = {success: true, data: cohorts};
        res.send(obj);
      })
      .catch(err => {
        let obj = {success: false, msg: "Alguno de los parámetros tiene un nombre o valor incorrecto"}
        res.send(obj);
      })
	},

}