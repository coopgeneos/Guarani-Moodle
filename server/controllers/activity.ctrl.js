const models = require('./../models');
const C_SIU_Activity = require('./../models').C_SIU_Activity
const C_SIU_School_Period = require('./../models').C_SIU_School_Period
const C_SIU_Assignment = require('./../models').C_SIU_Assignment
const I_SyncDetail = require('./../models').I_SyncDetail
const I_Config = require('./../models').I_Config
const axios = require('axios');
const url = require('url');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


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
    				let acts = removeDuplicatedObjects(activities, 'siu_activity_code');
    				debugger;		    				
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

            // Year in C_Scholl_Period isn't used yet. So we can assume year as current Year without problem
            if (isNaN(year )) {
              console.log('Error al parsear el año para el periodo lectivo. Se setea el año actual por defecto',currentValue.periodo_lectivo)
              let currentYear = new Date();
              year = currentYear.getFullYear();
            }
              
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
    				let perds = removeDuplicatedObjects(periods, 'C_SIU_School_Period_id')
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
		let periods = [];
		for (let i=0; i<assignments.length; i++) {
			let currentValue = assignments[i];			
			if (periods.indexOf(currentValue.periodo_lectivo.periodo_lectivo) == -1)
				periods.push(currentValue.periodo_lectivo.periodo_lectivo);
	    }

		C_SIU_Assignment.destroy({where: {c_siu_school_period_id: periods}})
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
	    				let toCreate = assigs;
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


function queryOnSIUDigest (uri, token) {
	return new Promise((resolve, reject) => {
		var q = url.parse(uri, true);
		const credentials = token.split(":");
		var digestRequest = require('request-digest')(credentials[0], credentials[1]);
		console.log(q.host,q.pathname,credentials);
		digestRequest.request({
			  host: 'http://'+q.host,
			  path: q.pathname+'?limit=99999',
			  port: 80,
			  method: 'GET',
			  headers: {
			    'Custom-Header': 'OneValue',
			    'Other-Custom-Header': 'OtherValue'
			  }
			}, function (error, response, body) {
				try {
					if (error || !body || body == 'undefined') {
						console.log('====> ERROR 500 consultando SIU GUARANI >>> ',response);
					    reject('====> ERROR 500 consultando en SIU GUARANI >>> ');
					}
					data = JSON.parse(body);
					if ( !(data instanceof Array)){
						console.log('====> ERROR 500 consultando en SIU GUARANI >>> ',data);
						reject('====> ERROR 500 consultando en SIU GUARANI >>> ');
					}
					resolve({response:data});

				}
				catch (err){
					console.log(body);
					console.log(err);
					reject(err);
				}
				
			
		});

	})
}

function queryOnSIUBasic (uri, token) {
	let buff = new Buffer(token)
	let hash = buff.toString('base64');  
  const Basic = 'Basic ' + hash;   
	return axios.get(uri + '?limit=9999', 
    { headers : { 'Authorization' : Basic }});
}

function queryOnSIU (authmode, uri, token) {
	if (authmode == 'DIGEST'){
		return queryOnSIUDigest(uri, token)
	}
	if (authmode == 'BASIC'){
		return queryOnSIUBasic(uri, token);
	}
	return Promise.reject('authmode not FOUND: '+authmode);

}




module.exports = {
	getAll: (req, res, next) => {
		C_SIU_Activity.findAll({
								attributes: {exclude: ['createdAt', 'updatedAt']}, 
								include: [
								{
									model: C_SIU_Assignment, 
									attributes: {exclude: ['createdAt', 'updatedAt']},
									include: [{
										model: I_SyncDetail, 
										attributes: {exclude: ['createdAt', 'updatedAt']}, 
									}]
								}]
							})
			.then(acts => {
				let obj = {success: true, data: acts};
        res.send(obj);
			})
			.catch(err => {
				console.log(err);
				let obj = {success: false, msg: "Hubo un error al consultar las actividades"};
        res.send(obj);
			});
	},

	getAllForPeriod: (req, res, next) => {
    	C_SIU_Activity.findAll({attributes: {exclude: ['createdAt', 'updatedAt']}, 
								include: [{
									where: {c_siu_school_period_id:req.params.period},
									model: C_SIU_Assignment, 
									attributes: {exclude: ['createdAt', 'updatedAt']},
									include: [{
										model: I_SyncDetail, 
										attributes: {exclude: ['createdAt', 'updatedAt']}, 
									}] 
								}]
							})
			.then(acts => {
				let obj = {success: true, data: acts};
        res.send(obj);
			})
			.catch(err => {
				console.log(err);
				let obj = {success: false, msg: "Hubo un error al consultar las actividades"};
        res.send(obj);
			});
  	},

	update: (req, res, next) => {
		let token;
		let uri;
		let authmode;	
		Promise.all([
			I_Config.findOne({ where: {key: 'AUTHMODE'}}).then(t => {authmode = t.value}),
			I_Config.findOne({ where: {key: 'SIU_TOKEN'}}).then(t => {token = t.value}),
			I_Config.findOne({ where: {key: 'SIU_REST_URI'}}).then(u => {uri = u.value})
		])
			.then(values => {
				queryOnSIU(authmode, uri,token)
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
			    	console.log('RESPONSE ERROR', error);
			    	let obj = {success: false, msg: 'Hubo un error al consultar las comisiones'};
	        		res.send(obj);
			    });
				
			})
	}	


}