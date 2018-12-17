const models = require('./../models')
const I_SyncUp = require('./../models').I_SyncUp
const I_Sync = require('./../models').I_Sync
const I_SyncDetail = require('./../models').I_SyncDetail
const C_SIU_Assignment = require('./../models').C_SIU_Assignment
const C_SIU_Activity = require('./../models').C_SIU_Activity
const I_Config = require('./../models').I_Config
const C_MDL_SIU_User = require('./../models').C_MDL_SIU_User
const C_MDL_SIU_Processed = require('./../models').C_MDL_SIU_Processed
const I_Log = require('./../models').I_Log
const axios = require('axios');
const querystring = require('querystring');

function getCourseFromMoodle(url, token, name, shortname, categoryid){
	return new Promise((resolve, reject) => {
		let formData = {
	    wstoken: token, 
	    wsfunction: 'core_course_get_courses_by_field', 
	    moodlewsrestformat: 'json',
	    'field': 'shortname',
	    'value': shortname
	  };
	  axios.post(url, querystring.stringify(formData))
			.then(resp => {
				if(resp.data.courses.length > 0){
					resolve(resp.data.courses[0]);
				} else {
					formData = {
				    wstoken: token, 
				    wsfunction: 'core_course_create_courses', 
				    moodlewsrestformat: 'json',
				    'courses[0][fullname]': name,
				    'courses[0][shortname]': shortname,
				    'courses[0][categoryid]': categoryid
				  };
					axios.post(url, querystring.stringify(formData))
						.then(resp => {
							if(resp.data.exception){
								console.log('====>  ERROR al consultar curso en Moodle: ' + shortname + ' >>> ' + resp.data.message);
								reject(resp.data.message);
							}
							resolve(resp.data[0]);
						})
						.catch(err => {
							console.log('====>  ERROR al consultar curso en Moodle: ' + shortname + ' >>> ' + err);
							reject(err);
						})
				}			
			})
			.catch(err => {
				console.log('====>  ERROR al consultar curso en Moodle: ' + shortname +' >>> ' + err);
				reject(err);
			});
	})
}

function getGroupFromMoodle(url, token, courseid, name, descr){
	return new Promise((resolve, reject) => {
		let formData = {
	    wstoken: token, 
	    wsfunction: 'core_group_get_course_groups', 
	    moodlewsrestformat: 'json',
	    'courseid': courseid
	  };
		axios.post(url, querystring.stringify(formData))
			.then(resp => {
				if(resp.data.length > 0){
					for(var i=0; i<resp.data.length; i++){
						if(resp.data[i].name === name){
							return resolve(resp.data[i]);
						}
					}
				} 
				formData = {
			    wstoken: token, 
			    wsfunction: 'core_group_create_groups', 
			    moodlewsrestformat: 'json',
			    'groups[0][courseid]': courseid,
					'groups[0][name]': name,
					'groups[0][description]': descr
			  };
				axios.post(url, querystring.stringify(formData))
					.then(resp => {
						if(resp.data.exception){
							console.log('====>  ERROR al consultar grupo en Moodle: ' + name);
							reject(resp.data.message);
						}
						resolve(resp.data[0]);
					})
					.catch(err => {
						console.log('====>  ERROR al consultar grupo en Moodle: ' + name);
						reject(err);
					})			
			})
			.catch(err => {
				console.log('====>  ERROR al consultar grupo en Moodle: ' + name);
				reject(err);
			})
	})
}

function getUserFromMoodle(url, token, data, counter){
	return new Promise((resolve, reject) => {
		/* Busco el usuario en Moodle */
		let formData = {
	    wstoken: token, 
	    wsfunction: 'core_user_get_users', 
	    moodlewsrestformat: 'json',
	    'criteria[0][key]': 'username',
			'criteria[0][value]': data.username
	  };
		axios.post(url, querystring.stringify(formData))
			.then(usr => {
				/* Si existe, lo devuelvo */
				if(usr.data.users.length > 0){
					resolve(usr.data.users[0]);
				}

				/* Si no existe, lo creo */
				formData = {
			    wstoken: token, 
			    wsfunction: 'core_user_create_users', 
			    moodlewsrestformat: 'json',
			    'users[0][username]': data.username,
					'users[0][password]': data.password,
					'users[0][createpassword]': 1,
					'users[0][firstname]': data.firstname,
					'users[0][lastname]': data.lastname,
					'users[0][email]': data.email
			  };
				axios.post(url, querystring.stringify(formData))
					.then(resp => {
						counter.created = counter.created + 1;					
						//Devuelvo la posición 0 del arreglo porque supongo que lo que estoy creando en Moodle no existe
						resolve(resp.data[0]);
					})
					.catch(err => {
						console.log('====>  ERROR al consultar usuario en Moodle: ' + data.username);
						reject(err);
					})
			})
			.catch(err => {
				console.log('====>  ERROR al consultar usuario en Moodle: ' + data.username);
				reject(err);
			})		
	})
}

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
				console.log('====>  ERROR consultando los usuarios en SIU GUARANI ');
				reject('ERROR: Consultando Ws de SIU >>> '+ url);
			})

	})
}

function enrolUsersInMoodle(url, token, userid, roleid, courseid, counter){
	return new Promise((resolve, reject) => {
		let formData = {
	    wstoken: token, 
	    wsfunction: 'enrol_manual_enrol_users', 
	    moodlewsrestformat: 'json',
	    'enrolments[0][roleid]': roleid,	    
			'enrolments[0][userid]': userid,
			'enrolments[0][courseid]': courseid		
	  };
		axios.post(url, querystring.stringify(formData))
			.then(resp => {
				/* El WS devuelve null, es porque enroló el usuario correctamente */
				if(resp.data === null){
					counter.registered = counter.registered + 1;
					resolve('OK');
				} else {
					if(resp.data.exception) {
						console.log("====> "+resp.data.message);
					}
					console.log('====>  ERROR al enrolar usuario en Moodle ' + userid + ' con parametros ' + roleid + ', ' + courseid);
					reject('ERROR al enrrolar usuario');
				}
			})
			.catch(err => {
				console.log('====>  ERROR al enrolar usuario en Moodle ' + userid + ' con parametros ' + roleid + ', ' + courseid);
				reject(err);
			})
		
	})
}

function addUsersToGroupInMoodle(url, token, userid, groupid){
	return new Promise((resolve, reject) => {
		let formData = {
	    wstoken: token, 
	    wsfunction: 'core_group_add_group_members', 
	    moodlewsrestformat: 'json',
	    'members[0][groupid]': groupid,
			'members[0][userid]': userid			
	  };
		axios.post(url, querystring.stringify(formData))
			.then(resp => {
				/* El WS devuelve null, es porque el usuario fue añadido al grupo correctamente */
				if(resp.data === null){
					resolve('OK');
				} else {
					if(resp.data.exception) {
						console.log("====> "+resp.data.message);
					}
					reject('ERROR al asignar usuario a un grupo');
				}
			})
			.catch(err => {
				reject(err);
			})
		
	})
}

function fixSIUUser(usr, array, log){
	return new Promise((resolve, reject) => {
		
		let containsKey = (list, key) => {
			for(elem in list){
				if(String(elem).toLowerCase().includes(String(key).toLowerCase())){}
					return true;
			}
			return false;
		}

		/* FIX USERNAME */
		if(usr.usuario === undefined){
			if(containsKey(array, 'username')){
				let dni = usr.documento;
				usr.usuario = dni.slice(4, dni.length);
				I_Log.create({message: 'Fix sobre el username de usuario ('+ dni +')', 
					level: '1', 
					i_syncDetail_id: log.i_syncDetail_id, 
					i_syncUp_id: log.i_syncUp_id});
			} else {
				reject('ERROR: usuario esta en blanco')
			}
		} 
		/* FIX EMAIL */
		if(usr.email === undefined){
			if(containsKey(array, 'email')){
				let dni = usr.documento;
				usr.email = usr.usuario+'@default.com';
				I_Log.create({message: 'Fix sobre el email de usuario ('+ dni +')', 
					level: '1', 
					i_syncDetail_id: log.i_syncDetail_id, 
					i_syncUp_id: log.i_syncUp_id});
			} else {
				reject('ERROR: email esta en blanco');
			}
		}
		/* FIX NAME */
		if(usr.nombres === undefined){
			if(containsKey(array, 'missingname')){
				usr.nombres = usr.usuario;
				I_Log.create({message: 'Fix sobre el nombre del usuario ('+ usr.usuario +')', 
					level: '1', 
					i_syncDetail_id: log.i_syncDetail_id, 
					i_syncUp_id: log.i_syncUp_id});
			} else {
				reject('ERROR: nombre esta en blanco');
			}
		}
		/* FIX LASTNAME */
		if(usr.apellido === undefined){
			if(containsKey(array, 'lastname')){
				usr.apellido = usr.usuario;
				I_Log.create({message: 'Fix sobre el apellido del usuario ('+ usr.apellido +')', 
					level: '1', 
					i_syncDetail_id: log.i_syncDetail_id, 
					i_syncUp_id: log.i_syncUp_id});
			} else {
				reject('ERROR: apellido esta en blanco');
			}
		}
		resolve('OK');
	})	
}

function processUser(siuusr, siu, mdl, fixArray, log, counter, mdl_course_id, mdl_group_id, mdl_role_id, siuurl, assg){
	return new Promise(async (resolve, reject) => {

		await fixSIUUser(siuusr, fixArray, log)
		 .catch ((err) => {	
				I_Log.create({
					message: err, 
					level: '0', 
					i_syncDetail_id: log.i_syncDetail_id, 
					i_syncUp_id: log.i_syncUp_id});
				reject(err);			
			})	

		C_MDL_SIU_User.findOne({where: {siu_user_id: siuusr.usuario}})
			.then( async(localusr) => {
				if(localusr && (localusr.mdl_user_id != null || localusr.mdl_user_id != undefined)){
					//
				} else {
					/* Creo el usuario en Moodle (Si no existe) */
					let data = {
						username: siuusr.usuario,
						password: siuusr.apellido+siuusr.alumno,
						createpassword: 1,
						firstname: siuusr.nombres,
						lastname: siuusr.apellido,
						email: siuusr.email
					};
					await getUserFromMoodle(mdl.url, mdl.token, data, counter.created)
						.then(mdl_user => {

							localusr = {mdl_user_id:mdl_user.id};

							/* Actualiza Cache (Actualizo el C_MDL_SIU_User) */
							C_MDL_SIU_User.upsert(
								{siu_user_id: siuusr.usuario, mdl_user_id: mdl_user.id},
								{
									where: {siu_user_id: siuusr.usuario, mdl_user_id: mdl_user.id}, 
									fields: ['mdl_user_id', 'siu_user_id']
								})										
								.catch(err => {
									I_Log.create({message: 'ERROR al actualizar localmente: '+data, 
										level: '0', 
										i_syncDetail_id: log.i_syncDetail_id, 
										i_syncUp_id: log.i_syncUp_id});
									reject(err);
								})
						})
						.catch(err => {
							I_Log.create({message: err, 
								level: '0', 
								i_syncDetail_id: log.i_syncDetail_id, 
								i_syncUp_id: log.i_syncUp_id});
							reject(err);
						});
				}

				/* Enrolamiento del usuario */
				await enrolUsersInMoodle(mdl.url, mdl.token, localusr.mdl_user_id, mdl_role_id, mdl_course_id, counter)
					.catch(err => {
						I_Log.create({message: 'ERROR al enrolar al usuario de moodle: '+localusr.mdl_user_id, 
							level: '0', 
							i_syncDetail_id: log.i_syncDetail_id, 
							i_syncUp_id: log.i_syncUp_id});
						reject(err);
					})

				/* Agrego el usuario al grupo */
				await addUsersToGroupInMoodle(mdl.url, mdl.token, localusr.mdl_user_id, mdl_group_id)
					.catch(err => {
						I_Log.create({message: 'ERROR al asignar el usuario '+localusr.mdl_user_id+' al grupo '+mdl_group_id+' en moodle', 
							level: '0', 
							i_syncDetail_id: log.i_syncDetail_id, 
							i_syncUp_id: log.i_syncUp_id});
						reject(err);
					})

				await C_MDL_SIU_Processed.create({
					i_sync_id: log.i_sync_id, 
					siu_assignment_code: assg.siu_assignment_code, 
					siu_user_id: siuusr.usuario, 
					mdl_group_id: mdl_group_id, 
					mdl_user_id: localusr.mdl_user_id
				})
					.then(prc => {
						resolve('Ok');
					})
					.catch(err => {
						I_Log.create({message: err, 
							level: '0', 
							i_syncDetail_id: log.i_syncDetail_id, 
							i_syncUp_id: log.i_syncUp_id});
						reject(err);
					})	
												
			})
			.catch(err => {
				I_Log.create({message: err.message, 
					level: '0', 
					i_syncDetail_id: log.i_syncDetail_id, 
					i_syncUp_id: log.i_syncUp_id});
				reject(err);
			})
	})
}

function createUsersInMoodle(siu, mdl, fixArray, log, counter, mdl_course_id, mdl_group_id, mdl_role_id, siuurl, assg) {
	return new Promise((resolve, reject) => {
		//var c=0;
		var prm_array = [];
		/* Obtengo los alumnos desde SIU */							
		queryOnSIU (siuurl, siu.token)
			.then( async (siuusers) => {
				for(var i=0; i<siuusers.length; i++){
					let siuusr = siuusers[i];
					prm_array.push(processUser(siuusr, siu, mdl, fixArray, log, counter, mdl_course_id, mdl_group_id, mdl_role_id, siuurl, assg));				
				}
				Promise.all(prm_array)
					.then((values) => {
						resolve('OK');
					})
					.catch((err) => {
						reject(err);
					})
			})
			.catch(err => {
				I_Log.create({message: err, 
					level: '0', 
					i_syncDetail_id: log.i_syncDetail_id, 
					i_syncUp_id: log.i_syncUp_id});
				reject(err);
			})
	})
}

function processCourse(detail, mdl, sync){
	return new Promise(async (resolve, reject) => {
		if(detail.mdl_course_id == null) {
			sync.shortname = mdl.shortname_prefix + sync.name.substring(0, 5);
			//El nombre viene determinado por el nombre de la sincronizacion
			let mdlact = await getCourseFromMoodle(
				mdl.url, 
				mdl.token, 
				sync.name, 
				sync.shortname,
				sync.mdl_category_id)
					.catch((err) => {
						console.log('=====> ERROR al consultar el curso de Moodle (processCourse)');
						reject('ERROR al consultar el curso de Moodle (processCourse)');
					})

			/* Actualizo el syncDetail con curso */
			await I_SyncDetail.update(
				{mdl_course_id: mdlact.id},
				{
					where: {i_sync_id: detail.i_sync_id}, 
					fields: ['mdl_course_id']
				})
					.catch((err) => {
						console.log('=====> ERROR al actualizar el syncDetail -> curso (processCourse)');
						reject('ERROR al actualizar el syncDetail -> curso (processCourse)');
					})

			resolve(mdlact.id);

		} else {
			resolve(detail.mdl_course_id);
		}
	})
}

function processDetail(detail, siu, mdl, sync, log, fixArray, counter, mdl_course_id){
	return new Promise(async(resolve, reject) => {
		
		let assg = await C_SIU_Assignment.findOne({where: {siu_assignment_code: detail.siu_assignment_code}})
			.catch((err) => {
				console.log('=====> ERROR al consultar C_SIU_Assignment (getCourseFromMoodle)');
				reject('ERROR al consultar C_SIU_Assignment (getCourseFromMoodle)');
			})

		/* Creo el grupo en Moodle y le asigno el curso antes creado */
		let mdl_group_id = detail.mdl_group_id

		if(mdl_group_id == null){
			let mdlgroup = await getGroupFromMoodle(					
				mdl.url, 
				mdl.token,
				mdl_course_id, 
				assg.name, 
				assg.name)
				.catch((err) => {
					console.log('=====> ERROR al consultar grupo de Moodle (getCourseFromMoodle)');
					reject('ERROR al consultar grupo de Moodle (getCourseFromMoodle)');
				})

			/* Actualizo el syncDetail con el grupo de moodle */
			await I_SyncDetail.update(
				{mdl_group_id: mdlgroup.id},
				{
					where: {I_SyncDetail_id: detail.I_SyncDetail_id}, 
					fields: ['mdl_group_id']
				})
				.catch((err) => {
					console.log('=====> ERROR al actualizar syncDetail ->grupo (getCourseFromMoodle)');
					reject('ERROR al actualizar syncDetail -> grupo (getCourseFromMoodle)');
				})

			mdl_group_id = mdlgroup.id;
		}
		
		mdl.groups.push(mdl_group_id);
		//let siuurl = siu.fixurl + '/' + assg.siu_assignment_code + '/alumnos?limit=9999';
		//let mdl_role_id = mdl.student_role_id;

		Promise.all([
			createUsersInMoodle(siu, mdl, fixArray, log, counter, mdl_course_id, mdl_group_id, mdl.student_role_id, 
				siu.fixurl + '/' + assg.siu_assignment_code + '/alumnos?limit=9999', 
				assg),
			createUsersInMoodle(siu, mdl, fixArray, log, counter, mdl_course_id, mdl_group_id, mdl.teacher_role_id, 
				siu.fixurl + '/' + assg.siu_assignment_code + '/docentes?limit=9999', 
				assg)
		])
			.then((values) => {
				resolve('Ok');
			})
			.catch((err) => {
				reject(err);
			})	
	})
}

/*functioERROR al enrolar usuario en Moodlen getUsersFromMoodle(url, token, userid, roleid, courseid, counter){
	return new Promise((resolve, reject) => {
		let formData = {
	    wstoken: token, 
	    wsfunction: 'enrol_manual_enrol_users', 
	    moodlewsrestformat: 'json',
	    'enrolments[0][roleid]': roleid,	    
			'enrolments[0][userid]': userid,
			'enrolments[0][courseid]': courseid		
	  };
		axios.post(url, querystring.stringify(formData))
			.then(resp => {
				// El WS devuelve null, es porque enroló el usuario correctamente 
				if(resp.data === null){
					counter.registered = counter.registered + 1;
					resolve('OK');
				} else {
					if(resp.data.exception) {
						console.log("====> "+resp.data.message);
					}
					console.log('====>  ERROR al enrolar usuario en Moodle ' + userid + ' con parametros ' + roleid + ', ' + courseid);
					reject('ERROR al enrrolar usuario');
				}
			})
			.catch(err => {
				console.log('====>  ERROR al enrolar usuario en Moodle ' + userid + ' con parametros ' + roleid + ', ' + courseid);
				reject(err);
			})
		
	})
}
*/
function getEnroledUsersFromMoodle(url, token, groupid){
	return new Promise((resolve, reject) => {
		let formData = {
	    wstoken: token, 
	    wsfunction: 'core_group_get_group_members', 
	    moodlewsrestformat: 'json',
			'groupids[0]': groupid	
	  };
		axios.post(url, querystring.stringify(formData))
			.then(resp => {
				if(resp.data.exception) {
					console.log("====> ERROR al consultar los usuarios matriculados en Moodle: "+ groupid + ' :: ' + resp.data.message);
					return reject('ERROR al consultar los usuarios matriculados en Moodle');
				}
				return resolve(resp.data[0].userids);				
			})
			.catch(err => {
				console.log("====> ERROR al consultar los usuarios matriculados en Moodle: "+ groupid + ' :: ' + err);
				reject(err);
			})
	})
}

function unenrolUsersFromMoodle(url, token, groupid, userid){
	return new Promise(async(resolve, reject) => {
		let formData = {
	    wstoken: token, 
	    wsfunction: 'core_group_delete_group_members', 
	    moodlewsrestformat: 'json',
			'members[0][groupid]': groupid,
			'members[0][userid]': userid
	  };
		axios.post(url, querystring.stringify(formData))
			.then(resp => {
				if(resp.data == null){
					return resolve('OK');	
				}
				if(resp.data.exception) {
					console.log("====> ERROR al quitar usuario de grupo en Moodle: "+ groupid + ' :: ' + resp.data.message);
					return reject('ERROR al quitar usuario de grupo en Moodle');
				}							
			})
			.catch(err => {
				console.log("====> ERROR al quitar usuario de grupo en Moodle: "+ groupid + ' :: ' + err);
				reject(err);
			})
	})
}

function unenrolUsers(mdl, siu_assignment_code, groupid, log){
	return new Promise(async(resolve, reject) => {
		//1 obtener los usuarios de una comision en siu
		//2 Obtener los usuarios del grupo de moodle que se corresponde con 1
		//3 Comparar los tamaños. Si son diferentes quiere decir que hay que desmatricular alguno

		//1
		let syncusers = await C_MDL_SIU_Processed.findAll({attributes: ['mdl_user_id'], where: {siu_assignment_code: siu_assignment_code}})
			.catch((err) => {
				reject('=====> ERROR al consultar los usuario procesados durante la sincronizacion ' + err);
			})
		var syncusers_id = [];
		for(var i=0; i<syncusers.length; i++){
			syncusers_id.push(syncusers[i].mdl_user_id);
		}
		//2
		let mdlusers = await getEnroledUsersFromMoodle(mdl.url, mdl.token, groupid)
			.catch((err) => {
				reject('=====> ERROR al consultar los usuario matriculados de Moodle ' + err);
			})
		//3
		//console.log('Tamaños: ' + syncusers_id.length + ', ' + mdlusers.length);
		//console.log(syncusers_id);
		//console.log(mdlusers);
		if(syncusers_id.length < mdlusers.length){
			var counter = 0;
			for(let i=0; i<mdlusers.length; i++){
				//Si el usuario esta en moodle pero no en siu, lo saco del grupo
				if(!syncusers_id.includes(mdlusers[i])){
					await unenrolUsersFromMoodle(mdl.url, mdl.token, groupid, mdlusers[i])
						.catch((err) => {
							reject('=====> ERROR al desmatricular usuarios de Moodle ' + err);
						})
					counter++;
				}
			}
			I_Log.create({message: 'Se desmatricularon '+ counter + ' usuarios del grupo con ID:' + groupid, 
				level: '2', 
				i_syncDetail_id: log.i_syncDetail_id, 
				i_syncUp_id: log.i_syncUp_id});
			console.log('Se desmatricularon '+ counter + ' usuarios del grupo con ID:' + groupid);
			return resolve('Se desmatricularon '+ counter + ' usuarios del grupo con ID:' + groupid);
		}
		console.log('No se desmatricularon usuarios del grupo con ID:'+groupid);
		return resolve('No se desmatricularon usuarios del grupo con ID:'+groupid);
	})
}


module.exports = {
  async syncUp (req, res, next) {

  	/* 1 Crear los cursos en Moodle */
		/* 2 Crear los grupos en Moodle */
		/* 3 Crear los usuario en Moodle */
		/* 4 Enrolar el usuario en Moodle - (Estudiante o Docente) */
		/* 5 Chequear si hay usuario eliminados */

		let syncup;
		let sync;
		let siutoken;
		let siuurl;
		let mdltoken;
		let mdlurl;
		let fixUsername;
		let fixEmail;
		let fixName;
		let fixLastname;
		let student_roleid;
		let teacher_roleid;
		let snprefix;
		
		Promise.all([
			I_SyncUp.create({I_Sync_id: req.params.id}).then(s => {syncup = s}),
			I_Config.findOne({ where: {key: 'SIU_TOKEN'}}).then(s => {siutoken = s}),
			I_Config.findOne({ where: {key: 'SIU_REST_URI'}}).then(s => {siuurl = s}),
			I_Config.findOne({ where: {key: 'MOODLE_REST_TOKEN'}}).then(s => {mdltoken = s}),
			I_Config.findOne({ where: {key: 'MOODLE_COURSE_SHORTNAME_PREFIX'}}).then(s => {snprefix = s}),
			I_Config.findOne({ where: {key: 'MOODLE_REST_URI'}}).then(s => {mdlurl = s}),
			I_Config.findOne({ where: {key: 'SIU_FIXMISSINGUSERNAME'}}).then(s => {fixUsername = s}),
			I_Config.findOne({ where: {key: 'SIU_FIXMISSINGEMAIL'}}).then(s => {fixEmail = s}),
			I_Config.findOne({ where: {key: 'SIU_FIXMISSINGNAME'}}).then(s => {fixName = s}),
			I_Config.findOne({ where: {key: 'SIU_FIXMISSINGLASTNAME'}}).then(s => {fixLastname = s}),
			I_Config.findOne({ where: {key: 'MOODLE_STUDENT_ROLE_ID'}}).then(s => {student_roleid = s}),
			I_Config.findOne({ where: {key: 'MOODLE_TEACHING_ROLE_ID'}}).then(s => {teacher_roleid = s}),
			C_MDL_SIU_Processed.destroy({ where: {i_sync_id: req.params.id}})
		])
		.then(async (values) => {

			try {
				let fixArray = [fixUsername.key, fixEmail.key, fixName.key, fixLastname.key];

				sync = await I_Sync.findOne({where: {I_Sync_id: req.params.id}})

				let details = await I_SyncDetail.findAll({where: {i_sync_id: sync.I_Sync_id}});

				var counter = {
					created: 0,
					registered: 0,
					unregistered: 0
				};

				var siu = {
					fixurl: siuurl.dataValues.value,
					token: siutoken.dataValues.value,					
				};

				var mdl = {
					url: mdlurl.dataValues.value,
					token: mdltoken.dataValues.value,
					shortname_prefix: snprefix.dataValues.value,
					student_role_id: student_roleid.dataValues.value,
					teacher_role_id: teacher_roleid.dataValues.value,
					groups: []
				}

				var log = {
					i_sync_id: sync.I_Sync_id,
					i_syncUp_id: syncup.I_SyncUp_id
				}

				var prm_array = [];

				let mdl_course_id = await processCourse(details[0], mdl, sync);

				for(var i=0; i<details.length; i++){
					let detail = details[i].dataValues;
					log.i_syncDetail_id = detail.I_SyncDetail_id, 		
					prm_array.push(processDetail(detail, siu, mdl, sync, log, fixArray, counter, mdl_course_id));
				}

				Promise.all(prm_array)
					.then( async (values) => {
						I_Log.create({message: 'Se crearon '+ counter.created + ' usuarios en Moodle', 
							level: '2', 
							i_syncDetail_id: log.i_syncDetail_id, 
							i_syncUp_id: log.i_syncUp_id});
						I_Log.create({message: 'Se matricularon '+ counter.registered + ' usuarios en Moodle', 
							level: '2', 
							i_syncDetail_id: log.i_syncDetail_id, 
							i_syncUp_id: log.i_syncUp_id});
						//TODO: Sacar usuarios no matriculados
						var _array = [];
						for (var j=0; j<details.length; j++) {
						  _array.push(unenrolUsers(mdl, details[j].siu_assignment_code, details[j].mdl_group_id, log));
						}

						Promise.all(_array)
							.then((vals) => {
								let obj = {success: true, msg: 'Se sincronizó todo exitosamente. Consulte el log'};
								res.send(obj);
							})
							.catch((err) => {
								let obj = {success: false, msg: 'Ocurrió un error durante la sincronización (Desmatricualcion). Consulte el log'};
								res.send(obj);
							})						
					})
					.catch((err) => {
						let obj = {success: false, msg: 'Hubo un error durante la sincronización. Consulte el log'};
						res.send(obj);
					})

			} catch (err) {
				throw err;
			}			
		})
		.catch(err => {
			throw err;
		})
  }
}
