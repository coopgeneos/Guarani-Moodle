const models = require('./../models');
const C_SIU_Activity = require('./../models').C_SIU_Activity
const C_SIU_School_Period = require('./../models').C_SIU_School_Period
const C_SIU_Assignment = require('./../models').C_SIU_Assignment
const I_Config = require('./../models').I_Config
const axios = require('axios');

function removeDuplicatedObjects(array, objectKey){
		let index = [];
		let result = [];
		for (let i=0; i<array.length; i++){
			for (let j=i+1; j<array.length; j++){
				if(array[i][objectKey] === array[j][objectKey]){
					index.push(j);
				}
			}
		}
		for (let i=0; i<array.length; i++){
			if (!index.includes(i)) {
				result.push(array[i])
			}		
		}
		return result;
}

function containsObject(array, obj, objectKey){
	for (let i=0; i<array.length; i++){
		if(array[i][objectKey] === obj[objectKey]){
			return true;
		}
	}
	return false;
}

function updateActivities(assignments) {
	return new Promise((resolve, reject) => {
		let activities = [];
		for (let i=0; i<assignments.length; i++) {	
    	let currentValue = assignments[i];
			C_SIU_Activity.findOne({ where: {siu_activity_code: currentValue.actividad.codigo} })
				.then(act => {
					if (act == null) {
    				let obj = {
    					siu_activity_code: currentValue.actividad.codigo, 
    					name: currentValue.actividad.nombre,
    					createdAt: new Date(),
    					updatedAt: new Date()
    				};
    				activities.push(obj);	    					
    			}
    			if (i === assignments.length -1) {
    				let acts = removeDuplicatedObjects(activities, 'siu_activity_code')		    				
						C_SIU_Activity.bulkCreate(acts)
							.then(activs => {
								resolve(activs);
							})
							.catch(err => {
								console.log(err);
								reject(err);
							})
    			}
				})
				.catch(err => {
					console.log(err);
					reject(err);
			});
		}
	})
}

function updateSchoolPeriods(assignments) {
	return new Promise((resolve, reject) => {
		let periods = [];
		for (let i=0; i<assignments.length; i++) {
			let currentValue = assignments[i];			
			C_SIU_School_Period.findOne({ where: {name: currentValue.periodo_lectivo.nombre} })
    		.then(period => {
    			if (period == null) {
    				let year = currentValue.periodo_lectivo.nombre.substring(currentValue.periodo_lectivo.nombre.length - 5, currentValue.periodo_lectivo.nombre.length);
    				year = Number(year);
    				let obj = {
    					C_SIU_School_Period_id: currentValue.periodo_lectivo.periodo_lectivo, 
    					name: currentValue.periodo_lectivo.nombre,
    					year: year,
    					createdAt: new Date(),
    					updatedAt: new Date()
    				};
    				periods.push(obj);
    			}
    			if (i === assignments.length -1) {
    				let perds = removeDuplicatedObjects(periods, 'name')
						C_SIU_School_Period.bulkCreate(perds)
							.then(result => {
								resolve(result);
							})
							.catch(err => {
								console.log(err);
								reject(err);
							})
    			}
    		})
    		.catch(err => {
    			console.log(err);
    			reject(err);
    		});		
	  }
	})
}

function updateAssignments(assignments) {
	return new Promise((resolve, reject) => {
		let period = assignments[0].periodo_lectivo.periodo_lectivo;
		C_SIU_Assignment.destroy({where: {c_siu_school_period_id: period}})
			.then(affectedRows => {
				let assigs = [];
				for (let i=0; i<assignments.length; i++) {
					let currentValue = assignments[i];
  				let obj = {
  					siu_assignment_code: currentValue.comision,
  					name: currentValue.nombre,
  					c_siu_school_period_id: currentValue.periodo_lectivo.periodo_lectivo, 
  					siu_activity_code: currentValue.actividad.codigo,
  					createdAt: new Date(),
  					updatedAt: new Date()
  				};
  				assigs.push(obj);
    			if (i === assignments.length -1) {
    				let toCreate = removeDuplicatedObjects(assigs, 'name')
						C_SIU_Assignment.bulkCreate(toCreate)
							.then(result => {
								resolve(result);
							})
							.catch(err => {
								console.log(err);
								reject(err);
							})
    			}	    		
				}
			})
			.catch(err => {
  			console.log(err);
  			reject(err);
  		});
	})
}

module.exports = {
	getAll: (req, res, next) => {
		C_SIU_Activity.findAll({attributes: {exclude: ['createdAt', 'updatedAt']}, 
														include: [{
															model: C_SIU_Assignment, 
															attributes: {exclude: ['createdAt', 'updatedAt']} 
														}]
													})
			.then(acts => {
				let obj = {success: true, data: acts};
        res.send(obj);
			})
			.catch(err => {
				let obj = {success: false, msg: "Hubo un error al consultar las actividades"};
        res.send(obj);
			});
	},

	update: (req, res, next) => {
		let token;
		let uri;	
		Promise.all([
			I_Config.findOne({ where: {key: 'SIU_TOKEN'}}).then(t => {token = t.value}),
			I_Config.findOne({ where: {key: 'SIU_REST_URI'}}).then(u => {uri = u.value})
		])
			.then(values => {
				let buff = new Buffer(token)
				let hash = buff.toString('base64');  
		    const Basic = 'Basic ' + hash;	    
				axios.get(uri, 
					{headers : { 'Authorization' : Basic }})
				  .then(response => {
				    let assigs = response.data;
				    Promise.all([updateActivities(assigs), updateSchoolPeriods(assigs)])
				    	.then(values => {
		 						updateAssignments(assigs)
		 							.then(result => {
		 								let obj = {success: true, msg: 'Se actualizó la información correctamente'};
		        				res.send(obj);
		 							})
		 							.catch(err => {
		 								console.log(err);
		 								let obj = {success: false, msg: 'Hubo un error al actualizar las comisiones'};
		        				res.send(obj);
		 							});
				    	})
				    	.catch(err => {
				    		console.log(err);
				    		let obj = {success: false, msg: 'Hubo un error al actualizar las actividades y períodos'};
		        		res.send(obj);
				    	});    	    	
				  })
				  .catch(error => {
				    console.log('RESPONSE ERROR \n'+error);
				    let obj = {success: false, msg: 'Hubo un error al consultar las comisiones'};
		        res.send(obj);
				  });
			})
	}	
}