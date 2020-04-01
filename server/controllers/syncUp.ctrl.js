const models = require('./../models')
const sequelize = require('./../models').sequelize
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
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


function _doSyncUp(sync,mdl_prev_coll,syncup,
						fixUsername,fixEmail,fixName,fixLastname,siuurl,siutoken,
						mdlurl,mdltoken,snprefix,student_roleid,teacher_roleid,auth_method,
						default_password){
		return new Promise(async(resolve, reject) => {
			//Clear old users data
			let where = {i_sync_id: sync.I_Sync_id,mdl_role_id:[]}

			if (sync.task_teacher)
				where.mdl_role_id.push(teacher_roleid.dataValues.value);

			if (sync.task_student)
				where.mdl_role_id.push(student_roleid.dataValues.value);

			if (where.mdl_role_id.length == 0){
				return resolve('Se omite la sincronización '+ sync.name + ' ya que su configuración no incluye alumnos ni docentes')
			}

			C_MDL_SIU_Processed.destroy({ where: where})
			.then( async (value) => {

				try {

					let fixArray = [fixUsername.key, fixEmail.key, fixName.key, fixLastname.key];
					
					let syncCohort = {mdl_cohort_id:0}
					if (sync.i_syncCohort_id)
						syncCohort = await I_SyncCohort.findOne({ where: {I_SyncCohort_id: sync.i_syncCohort_id}});

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
						groups: [],
						prevent_collapse: mdl_prev_coll.dataValues.value,
						auth_method:auth_method.dataValues.value,
						default_password:default_password.dataValues.value,
					}

					var log = {
						i_sync_id: syncup.dataValues.I_Sync_id,
						i_syncUp_id: syncup.dataValues.I_SyncUp_id
					}

					var prm_array = [];

					I_Log.create({message: 'Comenzo la sincronización '+ sync.name, 
							level: '2', 
							i_syncDetail_id: 0, 
							i_syncUp_id: log.i_syncUp_id});

					let mdl_course_id = await processCourse(details[0], mdl, sync);

					for(var i=0; i<details.length; i++){
						let detail = details[i].dataValues;
						log.i_syncDetail_id = detail.I_SyncDetail_id; 		
						prm_array.push(processDetail(detail, siu, mdl, sync, log, fixArray, counter, mdl_course_id, syncCohort.mdl_cohort_id));
					}

					Promise.all(prm_array)
					.then(async (values) => {
						I_Log.create({message: 'Se crearon '+ counter.created + ' usuarios en Moodle', 
							level: '2', 
							i_syncDetail_id: log.i_syncDetail_id, 
							i_syncUp_id: log.i_syncUp_id});
						I_Log.create({message: 'Se matricularon '+ counter.registered + ' usuarios en Moodle', 
							level: '2', 
							i_syncDetail_id: log.i_syncDetail_id, 
							i_syncUp_id: log.i_syncUp_id});
						
						let details = await I_SyncDetail.findAll({where: {i_sync_id: sync.I_Sync_id}});
						var _array = [];
						for (var j=0; j<details.length; j++) {
							let detail = details[j].dataValues;
							log.i_syncDetail_id = detail.I_SyncDetail_id;

						  	_array.push(unenrolUsers(mdl, detail.siu_assignment_code, detail.mdl_group_id, log));
						  			  	
						}

						Promise.all(_array)
							.then((vals) => {
								//Set sync up has finalized
								I_SyncUp.update(
									{completed:true},
									{where:{I_SyncUp_id: syncup.dataValues.I_SyncUp_id}})
									.then((vals) => {
										console.log('Sincronización '+ sync.name + ' completa!')
										resolve ('Sincronización '+ sync.name + ' completa!')
									})									
									.catch(err => {
										console.log('ERROR al actualizar localmente',err)
										reject('ERROR al actualizar localmente: '+err) 
									})
								
							})
							.catch((err) => {
								console.log(err);
								reject('Ocurrió un error durante la sincronización (Desmatriculacion). Consulte el log. ' + err) 
							})						
					})
					.catch((err) => {
						console.log('Hubo un error inesperado durante la sincronización. ',err);
						reject('Hubo un error inesperado durante la sincronización. ' + err)
					})

				} catch (err) {
					console.log('Hubo un error inesperado durante la sincronización. ',err);
					reject('Hubo un error inesperado durante la sincronización. ' + err)
				}

			})
			.catch(err => {
				console.log('Hubo un error al limpiar datos de sincronizaciones anteriores. Consulte el log. ',err);
				reject('Hubo un error al limpiar datos de sincronizaciones anteriores. Consulte el log. ' + err)
			})	
		})	

	}

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
								console.log('====> ERROR al crear curso en Moodle: ' + shortname + ' >>> ' + resp.data.message);
								return reject(resp.data.message);
							}
							resolve(resp.data[0]);
						})
						.catch(err => {
							console.log('====> ERROR 500 al crear curso en Moodle: ' + shortname + ' >>> ' + err);
							reject(err);
						})
				}			
			})
			.catch(err => {
				console.log('====> ERROR 500 al consultar curso en Moodle: ' + shortname +' >>> ' + err);
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
							console.log('====> ERROR al crear grupo en Moodle: ' + name  +' >>> ' + resp.data.message);
							return reject(resp.data.message);
						}
						resolve(resp.data[0]);
					})
					.catch(err => {
						console.log('====> ERROR 500 al crear grupo en Moodle: ' + name +' >>> ' + err);
						reject(err);
					})			
			})
			.catch(err => {
				console.log('====> ERROR 500 al consultar grupo en Moodle: ' + name +' >>> ' + err);
				reject(err);
			})
	})
}

/**
 * Funcion que busca usuario en Moodle.
 * Sino lo encuentra lo crea y lo devuelve
 * @param {*} url 
 * @param {*} token 
 * @param {*} data 
 * @param {*} counter 
 * @param {*} mdl_cohort_id 
 * @param {*} log 
 */
function getUserFromMoodle(url, token, data, counter, mdl_cohort_id, log){
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
					return resolve(usr.data.users[0]);
				}

				/* Si no existe, lo creo */
				formData = {
			    wstoken: token, 
			    wsfunction: 'core_user_create_users', 
			    moodlewsrestformat: 'json',
			    'users[0][username]': data.username,
					'users[0][password]': data.password,
					'users[0][createpassword]': 0, // 1
					'users[0][firstname]': data.firstname,
					'users[0][lastname]': data.lastname,
					'users[0][email]': data.email,
					'users[0][auth]':data.auth
			  };
				axios.post(url, querystring.stringify(formData))
					.then(async resp => {

						if (!resp.data[0] || !resp.data[0].id){
							console.log(formData)
							console.log(resp.data)
							return reject("Error al crear usuario (Username:"+data.username+", Nombre y Apellido: "+data.firstname+" "+data.lastname+", Email: "+data.email+") en Moodle "+resp.data.message);
						}

						counter.created = counter.created + 1;	

						if (mdl_cohort_id != 0){
              console.log("Agregando a COHORTE",mdl_cohort_id);
							/* Agrego el usuario al cohorte */
							await addUserToCohortInMoodle(url, token, resp.data[0].id, mdl_cohort_id)
							.catch(err => {
								return reject('ERROR al asignar el usuario '+resp.data[0].id+' al cohorte '+mdl_cohort_id+' en moodle',err);
							})
						}

						resolve(resp.data[0]);
					})
					.catch(err => {
						console.log('====> ERROR 500 al crear usuario en Moodle: ' + data.username +' >>> ' + err);
						reject(err);
					})
			})
			.catch(err => {
				console.log('====> ERROR 500 al consultar usuario en Moodle: ' + data.username +' >>> ' + err);
				return reject(err);
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
				if ( !(response.data instanceof Array)){
					console.log('====> ERROR 500 consultando los usuarios en SIU GUARANI (Error) >>> ' + response.data);
          console.log('====> URL >>> ' + url);
          reject(response.data);
				}

				resolve(response.data);
			})
			.catch(err => {
        console.log('====> ERROR 500 consultando los usuarios en SIU GUARANI (Catch) >>> ' + err);
        console.log('====> URL >>> ' + url);
				reject(err);
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
					return resolve('OK');
				} else {
					if(resp.data.exception) {
            console.log("====> ERROR al enrolar usuario en Moodle : "+resp.data.message);
						return reject(resp.data.message);
					}
					console.log('====> ERROR al enrolar usuario en Moodle ' + userid + ' con parametros ' + roleid + ', ' + courseid);
					return reject('ERROR al enrolar usuario en Moodle ' + userid + ' con parametros ' + roleid + ', ' + courseid);
				}
			})
			.catch(err => {
        //Si el error es que no encontro el usuario entonces borro vinculacion y vuelvo a intentar.
				console.log('====> ERROR 500 al enrolar usuario en Moodle ' + userid + ' con parametros ' + roleid + ', ' + courseid + ' >>> ' + err);
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
						console.log("====> ERROR al agregar miembro a un grupo: " + userid + ", " + groupid + " :: " + resp.data.message);
						return reject(resp.data.message);
					}
					reject("ERROR al agregar miembro a un grupo");
				}
			})
			.catch(err => {
				console.log("====> ERROR 500 al agregar miembro a un grupo: " + userid + ", " + groupid + " :: " + err);
				reject(err);
			})
		
	})
}

function addUserToCohortInMoodle(url, token, userid, cohortid){
	return new Promise((resolve, reject) => {
		let formData = {
	    wstoken: token, 
	    wsfunction: 'core_cohort_add_cohort_members', 
	    moodlewsrestformat: 'json',
	    'members[0][cohorttype][type]': 'id',
			'members[0][cohorttype][value]': cohortid,
			'members[0][usertype][type]': 'id',
			'members[0][usertype][value]': userid			
	  };
		axios.post(url, querystring.stringify(formData))
			.then(resp => {
				/* El WS devuelve un arreglo vacio, es porque el usuario fue añadido al cohorte correctamente */
				if(resp.data.warnings.length == 0){
					resolve('OK');
				} else {
					if(resp.data.warnings[0]) {
						console.log("====> ERROR al agregar miembro a un cohorte: " + userid + ", " + cohortid + " :: " + resp.data.warnings[0].message);
						return reject(resp.data.warnings[0].message);
					}
					reject("ERROR al agregar miembro a un cohorte");
				}
			})
			.catch(err => {
				console.log("====> ERROR 500 al agregar miembro a un cohorte: " + userid + ", " + cohortid + " :: " + err);
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
		if(usr.usuario === undefined || isNaN(usr.usuario)){
			if(containsKey(array, 'username')){
				//Rechazo pq el nombre de usuario deberia ser el DNI.
        //TODO: el campo dni en guarani 3.15 es tipo_nro_documento
        
        let dni = null;
				if (usr.documento)	
					dni = usr.documento;

				if (dni===null && usr.tipo_nro_documento)
					dni = usr.tipo_nro_documento;

				if (dni === null || dni === undefined){
					reject("No se pudo recuperar usuario a partir de DNI, DNI no esta definido para usuario: "+usr.usuario);
				}

				if (dni === undefined)
					reject("No se pudo recuperar usuario a partir de DNI, DNI no esta definido para usuario: "+usr.usuario);

				usr.usuario = dni.slice(4, dni.length);
				
				if (isNaN(usr.usuario))
					reject("No se pudo recuperar usuario a partir de DNI, formato incompatible. Usuario: "+usr.usuario+ ', DNI: '+dni);
      
        I_Log.create({message: 'Fix sobre usuario ('+ dni +')', 
					level: '1', 
					i_syncDetail_id: log.i_syncDetail_id, 
          i_syncUp_id: log.i_syncUp_id});
          
			} else {
        console.log("ERROR: usuario esta en blanco",usr);
				reject('ERROR: usuario esta en blanco pero no esta configurado para hacer fix')
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
/**
 * Esta funcion se encarga de procesar el usuario:
 * - hace un FIX sobre el usuario (Corrije y valida algunos campos)
 * - Busca el usuario en moodle en cache local
 *  - Si no lo encuentra entonces lo busca en moodle
 *  - Si no lo encuentra entonces lo crea
 * - Matricula el usuario con el rol correspondiente en el curso
 * - Agrega el usuario al Grupo
 * @param {*} siuusr 
 * @param {*} siu 
 * @param {*} mdl 
 * @param {*} fixArray 
 * @param {*} log 
 * @param {*} counter 
 * @param {*} mdl_course_id 
 * @param {*} mdl_group_id 
 * @param {*} mdl_role_id 
 * @param {*} siuurl 
 * @param {*} assg 
 * @param {*} mdl_cohort_id 
 */
function processUser(siuusr, siu, mdl, fixArray, log, counter, mdl_course_id, mdl_group_id, mdl_role_id, siuurl, assg, mdl_cohort_id){
	return new Promise(async (resolve, reject) => {
		await fixSIUUser(siuusr, fixArray, log)
		 .catch ((err) => {	
				reject(err);			
			})	

		C_MDL_SIU_User.findOne({where: {siu_user_id: siuusr.usuario}})
			.then(async(localusr) => {
				if(localusr == null || localusr.mdl_user_id == null || localusr.mdl_user_id == 0){ //Si no existe en la Caché local
					/* Creo el usuario en Moodle (Si no existe) */
					let data = {
						username: siuusr.usuario,
						password: mdl.default_password,
						createpassword: 1,
						firstname: siuusr.nombres,
						lastname: siuusr.apellido,
						email: siuusr.email,
						auth: mdl.auth_method
					};
					await getUserFromMoodle(mdl.url, mdl.token, data, counter, mdl_cohort_id, log)
						.then((mdl_user) => {

							localusr = {mdl_user_id:mdl_user.id};

							/* Actualiza Cache (Actualizo el C_MDL_SIU_User) */
							C_MDL_SIU_User.upsert(
								{siu_user_id: siuusr.usuario, mdl_user_id: mdl_user.id},
								{
									where: {siu_user_id: siuusr.usuario, mdl_user_id: mdl_user.id}, 
									fields: ['mdl_user_id', 'siu_user_id']
								})										
								.catch(err => {
                  console.log('ERROR al actualizar localmente:',err);
									I_Log.create({message: 'ERROR al actualizar localmente: '+data.username, 
										level: '0', 
										i_syncDetail_id: log.i_syncDetail_id, 
										i_syncUp_id: log.i_syncUp_id});
									//Just log error and Continue sincronization
									resolve('OK')
								})
						})
						.catch( err => {
							console.log(err);
							I_Log.create({message: err, 
								level: '0', 
								i_syncDetail_id: log.i_syncDetail_id, 
								i_syncUp_id: log.i_syncUp_id})
							//Just log error and Continue sincronization
							resolve('OK')
						});
				}

				if(localusr.mdl_user_id == undefined || typeof localusr.mdl_user_id == 'undefined'){
					I_Log.create({message: 'El usuario de SIU '+siuusr.usuario+' quedó sin asociar en Moodle ('+siuusr.usuario+','+siuusr.apellido+','+siuusr.nombres+','+siuusr.email+')', 
						level: '0', 
						i_syncDetail_id: log.i_syncDetail_id, 
						i_syncUp_id: log.i_syncUp_id});
					//Just log error and Continue sincronization
					resolve('OK')
				}

				/* Enrolamiento del usuario */
				await enrolUsersInMoodle(mdl.url, mdl.token, localusr.mdl_user_id, mdl_role_id, mdl_course_id, counter)
					.catch(async function(err) {
						I_Log.create({message: 'ERROR al enrolar al usuario de con ID en moodle: '+localusr.mdl_user_id, 
							level: '0', 
							i_syncDetail_id: log.i_syncDetail_id, 
              i_syncUp_id: log.i_syncUp_id});
            
            //If this is the error then delete user from local cache so next sincronization its ok!
            if (err.includes("User ID does not exist or is deleted!")) {
              await C_MDL_SIU_User.destroy({where: {mdl_user_id: localusr.mdl_user_id}});
            }

						//Just log error and Continue sincronization
						return resolve('OK')
					})

				/* Agrego el usuario al grupo */
				await addUsersToGroupInMoodle(mdl.url, mdl.token, localusr.mdl_user_id, mdl_group_id)
					.catch(err => {
						I_Log.create({message: 'ERROR al asignar el usuario '+localusr.mdl_user_id+' al grupo '+mdl_group_id+' en moodle', 
							level: '0', 
							i_syncDetail_id: log.i_syncDetail_id, 
							i_syncUp_id: log.i_syncUp_id});
						//Just log error and Continue sincronization
						resolve('OK')
					})

				await C_MDL_SIU_Processed.create({
					i_sync_id: log.i_sync_id, 
					siu_assignment_code: assg.siu_assignment_code, 
					siu_user_id: siuusr.usuario, 
					mdl_group_id: mdl_group_id, 
					mdl_user_id: localusr.mdl_user_id,
					mdl_role_id: mdl_role_id
				})
					.then(prc => {
						resolve('Ok');
					})
					.catch(err => {
						reject(err);
					})	
												
			})
			.catch(err => {
				reject(err);
			})
	})
}

/**
 * Se encarga de iterar sobre los usuarios del SIU para una comision dada
 * Por cada usuario verifica su existencia en moodle y lo matricula si corresponde.
 * 
 * @param {*} siu 
 * @param {*} mdl 
 * @param {*} fixArray 
 * @param {*} log 
 * @param {*} counter 
 * @param {*} mdl_course_id 
 * @param {*} mdl_group_id 
 * @param {*} mdl_role_id 
 * @param {*} siuurl 
 * @param {*} assg 
 * @param {*} mdl_cohort_id 
 */
function createUsersInMoodle(siu, mdl, fixArray, log, counter, mdl_course_id, mdl_group_id, mdl_role_id, siuurl, assg, mdl_cohort_id) {
	return new Promise((resolve, reject) => {
		var prm_array = [];
		/* Obtengo los alumnos/docentes desde SIU */							
		queryOnSIU (siuurl, siu.token)
			.then(async(siuusers) => {
				var err = null;
				if(mdl.prevent_collapse){
					for(var i=0; i<siuusers.length; i++){
						try {
							let siuusr = siuusers[i];
							await processUser(siuusr, siu, mdl, fixArray, log, counter, mdl_course_id, mdl_group_id, mdl_role_id, siuurl, assg, mdl_cohort_id)
						}
						catch(e) {
							console.log('Error procesando usuario',siuusers[i],e);
							I_Log.create({message: 'Error al procesar usuario: '+ e, 
							level: '0', 
							i_syncDetail_id: log.i_syncDetail_id, 
							i_syncUp_id: log.i_syncUp_id});
						}
					}
					resolve('OK');
				} else {
					for(var i=0; i<siuusers.length; i++){
						let siuusr = siuusers[i];
						prm_array.push(processUser(siuusr, siu, mdl, fixArray, log, counter, mdl_course_id, mdl_group_id, mdl_role_id, siuurl, assg, mdl_cohort_id));
					}
					Promise.all(prm_array)
						.then((values) => {
							resolve('OK');
						})
						.catch((err) => {
							reject(err);
						})
				}				
			})
			.catch(err => {
				reject(err);
			})
	})
}

function processCourse(detail, mdl, sync){
	return new Promise(async (resolve, reject) => {
		if(detail.mdl_course_id == null) {
			sync.shortname = mdl.shortname_prefix + sync.name.substring(0, 5) + '-'+sync.I_Sync_id;

			//Busco id de categoria
			let syncCategory = await I_SyncCategory.findOne({ where: {I_SyncCategory_id: sync.i_syncCategory_id}});

			//El nombre viene determinado por el Codigo de la sincronizacion
			let mdlact = await getCourseFromMoodle(
				mdl.url, 
				mdl.token, 
				sync.name, 
				sync.code,
				syncCategory.mdl_category_id)
					.catch((err) => {
						console.log('====> ERROR al consultar el curso de Moodle (processCourse)');
						reject(err);
					})

			/* Actualizo el syncDetail con curso */
			await I_SyncDetail.update(
				{mdl_course_id: mdlact.id},
				{
					where: {i_sync_id: detail.i_sync_id}, 
					fields: ['mdl_course_id']
				})
					.catch((err) => {
						console.log('====> ERROR al actualizar el syncDetail -> curso (processCourse)');
						reject(err);
					})

			resolve(mdlact.id);

		} else {
			resolve(detail.mdl_course_id);
		}
	})
}

/**
 * Procesa un detalle de sincronizacion matriculando sus usuarios en moodle
 * y asignandolos al grupo correspondiente.
 * 
 * @param {*} detail 
 * @param {*} siu 
 * @param {*} mdl 
 * @param {*} sync 
 * @param {*} log 
 * @param {*} fixArray 
 * @param {*} counter 
 * @param {*} mdl_course_id 
 * @param {*} mdl_cohort_id 
 */

function processDetail(detail, siu, mdl, sync, log, fixArray, counter, mdl_course_id, mdl_cohort_id){
	return new Promise(async(resolve, reject) => {
		let assg = await C_SIU_Assignment.findOne({where: {siu_assignment_code: detail.siu_assignment_code}})
			.catch((err) => {
				console.log('====> ERROR al consultar C_SIU_Assignment (getCourseFromMoodle)');
				reject(err);
      })

		/* Creo el grupo en Moodle y le asigno el curso antes creado */
		let mdl_group_id = detail.mdl_group_id;

		if(mdl_group_id == null){
			let mdlgroup = await getGroupFromMoodle(					
				mdl.url, 
				mdl.token,
				mdl_course_id, 
				assg.name, 
				assg.name)
				.catch((err) => {
					reject(err);
				})

			/* Actualizo el syncDetail con el grupo de moodle */
			await I_SyncDetail.update(
				{mdl_group_id: mdlgroup.id},
				{
					where: {I_SyncDetail_id: detail.I_SyncDetail_id}, 
					fields: ['mdl_group_id']
				})
				.catch((err) => {
					console.log('====> ERROR al actualizar syncDetail -> grupo (getCourseFromMoodle)');
					reject(err);
				})

			mdl_group_id = mdlgroup.id;
		}
		
		mdl.groups.push(mdl_group_id);
		
		let promises = [];
		if(sync.task_student && sync.task_student == true){
			promises.push(createUsersInMoodle(siu, mdl, fixArray, log, counter, mdl_course_id, mdl_group_id, mdl.student_role_id, 
				siu.fixurl + '/' + assg.siu_assignment_code + '/alumnos?limit=9999', 
				assg, mdl_cohort_id));
		}
		if(sync.task_teacher && sync.task_teacher == true){
			promises.push(createUsersInMoodle(siu, mdl, fixArray, log, counter, mdl_course_id, mdl_group_id, mdl.teacher_role_id, 
				siu.fixurl + '/' + assg.siu_assignment_code + '/docentes?limit=9999', 
				assg, mdl_cohort_id));
    }

		Promise.all(promises)
			.then((values) => {
				resolve('Ok');
			})
			.catch((err) => {
				reject(err);
			})	
	})
}

function getEnroledUsersFromMoodleByRole(url, token, courseid, groupid, roleid){
	return new Promise((resolve, reject) => {
		let formData = {
	    wstoken: token, 
	    wsfunction: 'core_group_get_group_members', 
	    moodlewsrestformat: 'json',
	    	'courseid':courseid,
	    	'options[0][name]':'groupid',
			'options[0][value]': groupid
	  };
		axios.post(url, querystring.stringify(formData))
			.then(resp => {
				if(resp.data.exception) {
					console.log("====> ERROR al consultar los usuarios matriculados en Moodle: "+ groupid + ' :: ' + resp.data.message);
					return reject(resp.data.exception);
				}
				return resolve(resp.data[0].userids);				
			})
			.catch(err => {
				console.log("====> ERROR 500 al consultar los usuarios matriculados en Moodle: "+ groupid + ' :: ' + err);
				reject(err);
			})
	})
}

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
					return reject(resp.data.exception);
				}
				return resolve(resp.data[0].userids);				
			})
			.catch(err => {
				console.log("====> ERROR 500 al consultar los usuarios matriculados en Moodle: "+ groupid + ' :: ' + err);
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
					return reject(resp.data.exception);
				}							
			})
			.catch(err => {
				console.log("====> ERROR 500 al quitar usuario de grupo en Moodle: "+ groupid + ' :: ' + err);
				return reject(err);
			})
	})
}

function unenrolUsers(mdl, siu_assignment_code, groupid, log){
	return new Promise(async(resolve, reject) => {
		//1 obtener los usuarios de una comision en siu
		//2 Obtener los usuarios del grupo de moodle que se corresponde con 1
		//3 Comparar los tamaños. Si son diferentes quiere decir que hay que desmatricular alguno

    //1
		let syncusers = await C_MDL_SIU_Processed.findAll({where: {siu_assignment_code: siu_assignment_code}})
			.catch((err) => {
				return reject('====> ERROR al consultar los usuario procesados durante la sincronizacion ' + err);
			})

		var syncusers_id = [];
		for(var i=0; i<syncusers.length; i++){
			syncusers_id.push(syncusers[i].dataValues.mdl_user_id);
		}

		//2
		let mdlusers = await getEnroledUsersFromMoodle(mdl.url, mdl.token, groupid)
			.catch((err) => {
				return reject(err);
			})

		//3
		if(mdlusers && syncusers_id.length < mdlusers.length){
      var counter = 0;
			for(let i=0; i<mdlusers.length; i++){

				//Si el usuario esta en moodle pero no en siu, lo saco del grupo

				if(!syncusers_id.includes(mdlusers[i])){
					await unenrolUsersFromMoodle(mdl.url, mdl.token, groupid, mdlusers[i])
						.catch((err) => {
							return reject(err);
						})
					counter++;
				}
			}
			I_Log.create({message: 'Se desmatricularon '+ counter + ' usuarios del grupo con ID:' + groupid, 
				level: '2', 
				i_syncDetail_id: log.i_syncDetail_id, 
				i_syncUp_id: log.i_syncUp_id});
			return resolve('Se desmatricularon '+ counter + ' usuarios del grupo con ID:' + groupid);
		}
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
		let mdl_prev_coll;
		let fixUsername;
		let fixEmail;
		let fixName;
		let fixLastname;
		let student_roleid;
		let teacher_roleid;
		let snprefix;
		let syncCohort;
		let default_password;
		let auth_method;

		sync = await I_Sync.findOne({where: {I_Sync_id: req.params.id}})

		Promise.all([
			I_SyncUp.create({i_sync_id: req.params.id}).then(s => {syncup = s}),
			I_Config.findOne({ where: {key: 'SIU_TOKEN'}}).then(s => {siutoken = s}),
			I_Config.findOne({ where: {key: 'SIU_REST_URI'}}).then(s => {siuurl = s}),
			I_Config.findOne({ where: {key: 'MOODLE_REST_TOKEN'}}).then(s => {mdltoken = s}),
			I_Config.findOne({ where: {key: 'MOODLE_COURSE_SHORTNAME_PREFIX'}}).then(s => {snprefix = s}),
			I_Config.findOne({ where: {key: 'MOODLE_REST_URI'}}).then(s => {mdlurl = s}),
			I_Config.findOne({ where: {key: 'MOODLE_PREVENT_COLLAPSE'}}).then(s => {mdl_prev_coll = s}),
			I_Config.findOne({ where: {key: 'SIU_FIXMISSINGUSERNAME'}}).then(s => {fixUsername = s}),
			I_Config.findOne({ where: {key: 'SIU_FIXMISSINGEMAIL'}}).then(s => {fixEmail = s}),
			I_Config.findOne({ where: {key: 'SIU_FIXMISSINGNAME'}}).then(s => {fixName = s}),
			I_Config.findOne({ where: {key: 'SIU_FIXMISSINGLASTNAME'}}).then(s => {fixLastname = s}),
			I_Config.findOne({ where: {key: 'MOODLE_STUDENT_ROLE_ID'}}).then(s => {student_roleid = s}),
			I_Config.findOne({ where: {key: 'MOODLE_TEACHING_ROLE_ID'}}).then(s => {teacher_roleid = s}),
			I_Config.findOne({ where: {key: 'MOODLE_USER_DEFAULT_PASSWORD'}}).then(s => {default_password = s}),
			I_Config.findOne({ where: {key: 'CREATE_USER_MOODLE_AUTH'}}).then(s => {auth_method = s}),
		])
		.then( (values) => {

			let where = {$or:[{i_sync_id: sync.I_Sync_id},{i_sync_id:null}],mdl_role_id:[]}

			if (sync.task_teacher)
				where.mdl_role_id.push(teacher_roleid.dataValues.value);

			if (sync.task_student)
				where.mdl_role_id.push(student_roleid.dataValues.value);

			if (where.mdl_role_id.length == 0){
				I_Log.create({message: 'Se omite la sincronización '+ sync.name + ' ya que su configuración no incluye alumnos ni docentes', 
							level: '0', 
							i_syncDetail_id: 0, 
							i_syncUp_id: syncup.dataValues.I_SyncUp_id});
			}

			C_MDL_SIU_Processed.destroy({ where: where})
			.then( async (value) => {

				try {

					let fixArray = [fixUsername.key, fixEmail.key, fixName.key, fixLastname.key];
					
					let syncCohort = {mdl_cohort_id:0}
					if (sync.i_syncCohort_id)
						syncCohort = await I_SyncCohort.findOne({ where: {I_SyncCohort_id: sync.i_syncCohort_id}});

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
						groups: [],
						prevent_collapse: mdl_prev_coll.dataValues.value,
						auth_method:auth_method.dataValues.value,
						default_password:default_password.dataValues.value,
          }
          
					var log = {
						i_sync_id: syncup.dataValues.i_sync_id,
						i_syncUp_id: syncup.dataValues.I_SyncUp_id
					}

					var prm_array = [];

					// Send ok response and start doing the sync!
					res.send({success: true, name: sync.name});

					I_Log.create({message: 'Comenzo la sincronización '+ sync.name, 
							level: '2', 
							i_syncDetail_id: 0, 
              i_syncUp_id: log.i_syncUp_id});
          console.log('Comenzo la sincronización '+ sync.name);

					if (where.mdl_role_id.length == 0) {
						return
					}

					let mdl_course_id = await processCourse(details[0], mdl, sync);

					for(var i=0; i<details.length; i++){
						let detail = details[i].dataValues;
						log.i_syncDetail_id = detail.I_SyncDetail_id; 		
						prm_array.push(processDetail(detail, siu, mdl, sync, log, fixArray, counter, mdl_course_id, syncCohort.mdl_cohort_id));
					}

					Promise.all(prm_array)
					.then(async (values) => {
						I_Log.create({message: 'Se crearon '+ counter.created + ' usuarios en Moodle', 
							level: '2', 
							i_syncDetail_id: log.i_syncDetail_id, 
							i_syncUp_id: log.i_syncUp_id});
						I_Log.create({message: 'Se matricularon '+ counter.registered + ' usuarios en Moodle', 
							level: '2', 
							i_syncDetail_id: log.i_syncDetail_id, 
							i_syncUp_id: log.i_syncUp_id});
            
            /**
             * Itero por cada detalle y desmatriculo los usuarios correspondientes.
             */

            //Refresco detalles (para tener el grupo de moodle actualizado)
            details = await I_SyncDetail.findAll({where: {i_sync_id: sync.I_Sync_id}});

						var _array = [];
						for (var j=0; j<details.length; j++) {
							let detail = details[j].dataValues;
							log.i_syncDetail_id = detail.I_SyncDetail_id;
						  _array.push(unenrolUsers(mdl, detail.siu_assignment_code, detail.mdl_group_id, log));
						  			  	
						}

						Promise.all(_array)
							.then((vals) => {
								//Set sync up has finalized
								I_SyncUp.update(
									{completed:true},
									{where:{I_SyncUp_id: syncup.dataValues.I_SyncUp_id}})
									.then((vals) => {
										I_Log.create({message: 'Sincronización '+ sync.name + ' completa!', 
											level: '2', 
											i_syncDetail_id: 0, 
											i_syncUp_id: syncup.dataValues.I_SyncUp_id});
									})									
									.catch(err => {
										I_Log.create({message: 'ERROR al actualizar localmente: '+err, 
											level: '0', 
											i_syncDetail_id: 0, 
											i_syncUp_id: syncup.dataValues.I_SyncUp_id});
									})
								
							})
							.catch((err) => {
								console.log(err);
								I_Log.create({message: 'Ocurrió un error durante la sincronización (Desmatriculacion). Consulte el log. ' + err, 
											level: '0', 
											i_syncDetail_id: 0, 
											i_syncUp_id: syncup.dataValues.I_SyncUp_id});
							})						
					})
					.catch((err) => {
						console.log(err);
						I_Log.create({message: 'Hubo un error inesperado durante la sincronización. ' + err, 
							level: '0', 
							i_syncDetail_id: log.i_syncDetail_id, 
							i_syncUp_id: log.i_syncUp_id
						});
					})

				} catch (err) {
					console.log(err);
					I_Log.create({message: 'Hubo un error inesperado durante la sincronización. ' + err, 
						level: '0', 
						i_syncDetail_id: 0, 
						i_syncUp_id: syncup.dataValues.I_SyncUp_id
					});
				}
			})
			.catch(err => {
				console.log(err);
				let obj = {success: false, msg: 'Hubo un error al limpiar datos de sincronizaciones anteriores. Consulte el log. ' + err};
				res.send(obj);
			})			
		})
		.catch(err => {
			console.log(err);
			let obj = {success: false, msg: 'Hubo un error al iniciar la sincronización. Consulte el log. ' + err};
			res.send(obj);
		})
  	},

  	getAllForSync: (req, res, next) => {
    	I_SyncUp.findAll({
    						where: {i_sync_id:req.params.id},
    						attributes: {exclude: ['updatedAt']}, 
    						order: [
		                      ["createdAt","desc"],
		                      [I_Log,"I_Log_id","asc"]
		                    ],
							include: [{
								model: I_Log, 
								attributes: {exclude: ['createdAt', 'updatedAt']},
								include: [{
									model: I_SyncDetail, 
									attributes: {exclude: ['createdAt', 'updatedAt']},
									as: 'SyncDetail_id', 
								}] 
							}]
						})
			.then(syncs => {
				let obj = {success: true, data: syncs};
        		res.send(obj);
			})
			.catch(err => {
				console.log(err);
				let obj = {success: false, msg: "Hubo un error al consultar los Logs"};
        		res.send(obj);
			});
  	},

  	cleanLogs: (req, res, next) => {
    	sequelize.query("DELETE FROM I_Log WHERE I_SyncUp_ID not in ( SELECT id FROM (select MAX(I_SyncUp_ID) as id from I_Log where I_SyncDetail_id <> 0 GROUP BY I_SyncDetail_id) aux )")
    	.then(([results, metadata]) => {

    		sequelize.query("DELETE FROM I_SyncUp WHERE I_SyncUp_ID not in ( SELECT id FROM (select MAX(I_SyncUp_ID) as id from I_Log where I_SyncDetail_id <> 0 GROUP BY I_SyncDetail_id) aux )")
	    	.then(([results, metadata]) => {
				let obj = {success: true};
				res.send(obj);
			})
			.catch(err => {
				console.log(err);
				let obj = {success: false, msg: "Hubo un error al limpiar los Logs"};
	        	res.send(obj);
			});
		})
		.catch(err => {
			console.log(err);
			let obj = {success: false, msg: "Hubo un error al limpiar los Logs"};
        	res.send(obj);
		});
  	},


  	/** 
  	* Function que recibe como parametro un arreglo de sincronizaciones
  	* Ejectua las sincroniaciones una por una (De manera sincronica)
  	*
  	**/
  	async bulkSyncUp (req, res, next) {

  		if (!req.body.syncs) {
  			let obj = {success: false, msg: "Falta parametro {syncs}"};
        	return res.send(obj);
  		}

  		const syncs = req.body.syncs;

		let syncup;
		let sync;
		let siutoken;
		let siuurl;
		let mdltoken;
		let mdlurl;
		let mdl_prev_coll;
		let fixUsername;
		let fixEmail;
		let fixName;
		let fixLastname;
		let student_roleid;
		let teacher_roleid;
		let snprefix;
		let syncCohort;
		let default_password;
		let auth_method;

		// Load config
		Promise.all([
			I_Config.findOne({ where: {key: 'SIU_TOKEN'}}).then(s => {siutoken = s}),
			I_Config.findOne({ where: {key: 'SIU_REST_URI'}}).then(s => {siuurl = s}),
			I_Config.findOne({ where: {key: 'MOODLE_REST_TOKEN'}}).then(s => {mdltoken = s}),
			I_Config.findOne({ where: {key: 'MOODLE_COURSE_SHORTNAME_PREFIX'}}).then(s => {snprefix = s}),
			I_Config.findOne({ where: {key: 'MOODLE_REST_URI'}}).then(s => {mdlurl = s}),
			I_Config.findOne({ where: {key: 'MOODLE_PREVENT_COLLAPSE'}}).then(s => {mdl_prev_coll = s}),
			I_Config.findOne({ where: {key: 'SIU_FIXMISSINGUSERNAME'}}).then(s => {fixUsername = s}),
			I_Config.findOne({ where: {key: 'SIU_FIXMISSINGEMAIL'}}).then(s => {fixEmail = s}),
			I_Config.findOne({ where: {key: 'SIU_FIXMISSINGNAME'}}).then(s => {fixName = s}),
			I_Config.findOne({ where: {key: 'SIU_FIXMISSINGLASTNAME'}}).then(s => {fixLastname = s}),
			I_Config.findOne({ where: {key: 'MOODLE_STUDENT_ROLE_ID'}}).then(s => {student_roleid = s}),
			I_Config.findOne({ where: {key: 'MOODLE_TEACHING_ROLE_ID'}}).then(s => {teacher_roleid = s}),
			I_Config.findOne({ where: {key: 'MOODLE_USER_DEFAULT_PASSWORD'}}).then(s => {default_password = s}),
			I_Config.findOne({ where: {key: 'CREATE_USER_MOODLE_AUTH'}}).then(s => {auth_method = s}),
		])
		.then( async (values) => {

			// Send ok response and start doing the syncs!
			res.send({success: true});

			//Iterate over sYncs and start doing it (By one)
			for (let index = 0; index < syncs.length; index++) {
				
				syncs[index]
			
				console.log('Voy a sincronizar '+syncs[index])

				const syncup = await I_SyncUp.create({i_sync_id: syncs[index]})

				try {
					sync = await I_Sync.findOne({where: {I_Sync_id: syncs[index]}})
					const message = await _doSyncUp(sync,mdl_prev_coll,syncup,
						fixUsername,fixEmail,fixName,fixLastname,siuurl,siutoken,
						mdlurl,mdltoken,snprefix,student_roleid,teacher_roleid,auth_method,
						default_password)
					I_Log.create({message: message, 
						level: '2', 
						i_syncDetail_id: 0, 
						i_syncUp_id: syncup.dataValues.I_SyncUp_id});
				}
				catch (err) {
					I_Log.create({message: 'Hubo un error inesperado durante la sincronización. ' + err, 
						level: '0', 
						i_syncDetail_id: 0, 
						i_syncUp_id: syncup.dataValues.I_SyncUp_id});
				}

				console.log('Finalizo de sincronizar '+syncs[index])
				
			}
		})
		.catch( (err) => {
			console.log(err);
			let obj = {success: false, msg: 'Hubo un error al iniciar las sincronizaciónes. Consulte el log. ' + err};
			res.send(obj);
		})
	}

}
