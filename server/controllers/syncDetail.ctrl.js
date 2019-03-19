const models = require('./../models')
const I_SyncUp = require('./../models').I_SyncUp
const I_Sync = require('./../models').I_Sync
const I_SyncDetail = require('./../models').I_SyncDetail
const C_SIU_Assignment = require('./../models').C_SIU_Assignment
const C_SIU_Activity = require('./../models').C_SIU_Activity
const I_Config = require('./../models').I_Config
const C_MDL_SIU_User = require('./../models').C_MDL_SIU_User
const C_MDL_SIU_Processed = require('./../models').C_MDL_SIU_Processed
const I_SyncCategory = require('./../models').I_SyncCategory
const I_SyncCohort = require('./../models').I_SyncCohort
const I_Log = require('./../models').I_Log

const axios = require('axios');
const querystring = require('querystring');

function queryOnSIU (url, token) {
	return new Promise((resolve, reject) => {
		let buff = new Buffer(token);
		let hash = buff.toString('base64');  
	  	const Basic = 'Basic ' + hash;
		axios.get(url, {headers : { 'Authorization' : Basic }})
			.then(response => {
				resolve(response.data);
			})
			.catch(err => {
				console.log('====> ERROR 500 consultando los usuarios en SIU GUARANI >>> ' + err);
				reject(err);
			})

	})
}

function getSIUDetail(detail, siu){
	return new Promise(async(resolve, reject) => {
		
		let assg = await C_SIU_Assignment.findOne({where: {siu_assignment_code: detail.siu_assignment_code}})
			.catch((err) => {
				console.log('====> ERROR al consultar C_SIU_Assignment (getCourseFromMoodle)');
				reject(err);
			})

		//TODO
		var alumnosRequest = queryOnSIU (siu.siuurl + '/' + assg.siu_assignment_code +'/alumnos?limit=9999', siu.token)
			.then(async(siuusers) => {
				detail.dataValues.alumnos = siuusers
			});

		var docentesRequest = queryOnSIU (siu.siuurl + '/' + assg.siu_assignment_code +'/docentes?limit=9999', siu.token)
			.then(async(siuusers) => {
				detail.dataValues.docentes = siuusers
			});

		Promise.all([alumnosRequest,docentesRequest])
			.then((values) => {
				resolve(detail);
			})
			.catch((err) => {
				reject(err);
			})	
	})
}

module.exports = {
  async getSIUData (req, res, next) {

  		/* Obtiene toda la informacion para una comision de SIU */

		let syncDetail;
		let sync;
		
		let siutoken;
		let siuurl;

		
		Promise.all([
			I_Config.findOne({ where: {key: 'SIU_TOKEN'}}).then(s => {siutoken = s}),
			I_Config.findOne({ where: {key: 'SIU_REST_URI'}}).then(s => {siuurl = s}),
		])
		.then(async (values) => {

			syncDetail = await I_SyncDetail.findOne({where: {I_SyncDetail_id: req.params.id}})

			var siu = {
				siuurl: siuurl.dataValues.value,
				token: siutoken.dataValues.value,	
			};

			getSIUDetail(syncDetail, siu)
			.then( (values) => {
				res.send({success: true,data:values}); 
			})	
			.catch(err => {
				console.log(err);
				let obj = {success: false, msg: 'Hubo un error al obtener informacion de siu. ' + err};
				res.send(obj);
			})					
		})
		.catch(err => {
			console.log(err);
			let obj = {success: false, msg: 'Hubo un error al obtener informacion de siu. ' + err};
			res.send(obj);
		})
		
  },
}
