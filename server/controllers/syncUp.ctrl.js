const models = require('./../models')
const I_SyncUp = require('./../models').I_SyncUp
const I_Sync = require('./../models').I_Sync
const I_SyncDetail = require('./../models').I_SyncDetail
const C_SIU_Assignment = require('./../models').C_SIU_Assignment
const C_SIU_Activity = require('./../models').C_SIU_Activity
const I_Config = require('./../models').I_Config
const C_MDL_SIU_User = require('./../models').C_MDL_SIU_User
const I_Log = require('./../models').I_Log
const axios = require('axios');
const querystring = require('querystring');

function createCourseInMoodle(url, token, name, shortname, categoryid){
	return new Promise((resolve, reject) => {
		let formData = {
	    wstoken: token, 
	    wsfunction: 'core_course_create_courses', 
	    moodlewsrestformat: 'json',
	    'courses[0][fullname]': name,
	    'courses[0][shortname]': shortname,
	    'courses[0][categoryid]': categoryid
	  };
		axios.post(url, querystring.stringify(formData))
			.then(resp => {
				//Devuelvo la posición 0 del arreglo porque supongo que lo que estoy creando en Moodle no existe
				resolve(resp.data[0]);
			})
			.catch(err => {
				reject(err);
			})
		
	})
}

function createGroupInMoodle(url, token, courseid, name, descr){
	return new Promise((resolve, reject) => {
		let formData = {
	    wstoken: token, 
	    wsfunction: 'core_group_create_groups', 
	    moodlewsrestformat: 'json',
	    'groups[0][courseid]': courseid,
			'groups[0][name]': name,
			'groups[0][description]': descr
	  };
		axios.post(url, querystring.stringify(formData))
			.then(resp => {
				//Devuelvo la posición 0 del arreglo porque supongo que lo que estoy creando en Moodle no existe
				resolve(resp.data[0]);
			})
			.catch(err => {
				reject(err);
			})
		
	})
}

function getUserFromMoodle(url, token, data){
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
						//Devuelvo la posición 0 del arreglo porque supongo que lo que estoy creando en Moodle no existe
						resolve(resp.data[0]);
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
				reject('ERROR: Consultando Ws de SIU >>> '+url);
			})

	})
}

function enrolUsersInMoodle(url, token, userid, roleid, courseid){
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
				if(resp.data === null){
					resolve('OK');
				} else {
					reject('ERROR al enrrolar usuario');
				}
			})
			.catch(err => {
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
				if(resp.data === null){
					resolve('OK');
				} else {
					reject('ERROR al asignar usuario a un grupo');
				}
			})
			.catch(err => {
				reject(err);
			})
		
	})
}

function fixSIUUser(usr, array, syncup, detail){
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
					i_syncDetail_id: detail.I_SyncDetail_id, 
					i_syncUp_id: syncup.I_SyncUp_id});
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
					i_syncDetail_id: detail.I_SyncDetail_id, 
					i_syncUp_id: syncup.I_SyncUp_id});
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
					i_syncDetail_id: detail.I_SyncDetail_id, 
					i_syncUp_id: syncup.I_SyncUp_id});
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
					i_syncDetail_id: detail.I_SyncDetail_id, 
					i_syncUp_id: syncup.I_SyncUp_id});
			} else {
				reject('ERROR: apellido esta en blanco');
			}
		}
		resolve('OK');
	})	
}

function createUsersInMoodle(siuurl, siutoken, mdlurl, mdltoken, fixArray, courseid, roleid, groupid, syncup, detail) {
	return new Promise((resolve, reject) => {
		/* Obtengo los alumnos desde SIU*/							
		queryOnSIU (siuurl, siutoken)
			.then( async (siuusers) => {
				for(var i=0; i<siuusers.length; i++){
					let siuusr = siuusers[i];
					
					try {
						await fixSIUUser(siuusr, fixArray, syncup, detail);
					} catch (err) {			
						I_Log.create({
							message: err, 
							level: '0', 
							i_syncDetail_id: detail.I_SyncDetail_id, 
							i_syncUp_id: syncup.I_SyncUp_id});
						continue;						
					}

					C_MDL_SIU_User.findOne({where: {siu_user_id: siuusr.usuario}})
						.then( async(localusr) => {
							if(localusr && (localusr.mdl_user_id != null || localusr.mdl_user_id != undefined)){
								//return;
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
								await getUserFromMoodle(mdlurl, mdltoken, data)
									.then(mdl_user => {

										localusr = {mdl_user_id:mdl_user.id};

										/* Actualiza Cache (Actualizo el C_MDL_SIU_User)*/
										C_MDL_SIU_User.upsert(
											{siu_user_id: siuusr.usuario, mdl_user_id: mdl_user.id},
											{
												where: {siu_user_id: siuusr.usuario, mdl_user_id: mdl_user.id}, 
												fields: ['mdl_user_id', 'siu_user_id']
											})										
											.catch(err => {
												I_Log.create({message: 'ERROR al actualizar localmente: '+data, 
													level: '0', 
													i_syncDetail_id: detail.I_SyncDetail_id, 
													i_syncUp_id: syncup.I_SyncUp_id});
											})
									})
									.catch(err => {
										I_Log.create({message: err, 
											level: '0', 
											i_syncDetail_id: detail.I_SyncDetail_id, 
											i_syncUp_id: syncup.I_SyncUp_id});
									});
							}

							/* Enrolamiento del usuario */
							await enrolUsersInMoodle(mdlurl, mdltoken, localusr.mdl_user_id, roleid, courseid)
								.catch(err => {											
									I_Log.create({message: 'ERROR al enrolar al usuario de moodle: '+localusr.mdl_user_id, 
										level: '0', 
										i_syncDetail_id: detail.I_SyncDetail_id, 
										i_syncUp_id: syncup.I_SyncUp_id});
								})

							/* Agrego el usuario al grupo */
							addUsersToGroupInMoodle(mdlurl, mdltoken, localusr.mdl_user_id, groupid)
								.catch(err => {
									I_Log.create({message: 'ERROR al asignar el usuario '+localusr.mdl_user_id+' al grupo '+groupid+' en moodle', 
										level: '0', 
										i_syncDetail_id: detail.I_SyncDetail_id, 
										i_syncUp_id: syncup.I_SyncUp_id});
								})	
															
						})
						.catch(err => {
							I_Log.create({message: err, 
								level: '0', 
								i_syncDetail_id: detail.I_SyncDetail_id, 
								i_syncUp_id: syncup.I_SyncUp_id});
						})						
				}
			})
			.catch(err => {
				I_Log.create({message: err, 
					level: '0', 
					i_syncDetail_id: detail.I_SyncDetail_id, 
					i_syncUp_id: syncup.I_SyncUp_id});
			})
	})
}

module.exports = {
  async syncUp (req, res, next) {

  	/* 1 Crear los cursos en Moodle */
		/* 2 Crear los grupos en Moodle */
		/* 3 crear los Usuario en Moodle */
		/* 4 Enrolar el usuario en Moodle - (Estudiante o Docente) */
		/* 5 Asignar el usuario al grupo en Moodle */

		try {
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
				I_Config.findOne({ where: {key: 'MOODLE_TEACHING_ROLE_ID'}}).then(s => {teacher_roleid = s})
			])
			.then(async (values) => {

				let fixArray = [fixUsername.key, fixEmail.key, fixName.key, fixLastname.key];

				sync = await I_Sync.findOne({where: {I_Sync_id: req.params.id}})

				let details = await I_SyncDetail.findAll({where: {i_sync_id: sync.I_Sync_id}});

				//course id is the same for all details
				//TODO: Check first if some Detail alredy have a mdl_course_id
				let mdl_course_id = 0;

				for(var i=0; i<details.length; i++){
					let detail = details[i].dataValues;		
					

					/* Creo el curso en Moodle */
					if( detail.mdl_course_id == null) {
	
						if (mdl_course_id == 0) {
							
							//TODO: Definir shortname
							sync.shortname = snprefix.value + sync.name.substring(0, 5);
							//El nombre viene determinado por el nombre de la sincronizacion
							let mdlact = await createCourseInMoodle(
								mdlurl.value, 
								mdltoken.value, 
								sync.name, 
								sync.shortname,
								sync.mdl_category_id);

							mdl_course_id = mdlact.id;
						}

						/* Actualizo el syncDetail con curso */
						await I_SyncDetail.update(
							{mdl_course_id: mdl_course_id},
							{
								where: {I_SyncDetail_id: detail.I_SyncDetail_id}, 
								fields: ['mdl_course_id']
							});
					}
					else 
						mdl_course_id = detail.mdl_course_id;

					let assg = await C_SIU_Assignment.findOne({where: {siu_assignment_code: detail.siu_assignment_code}});

					/* Creo el grupo en Moodle y le asigno el curso antes creado */
					let mdl_group_id = detail.mdl_group_id

					if(mdl_group_id == null){
						let mdlgroup = await createGroupInMoodle(					
							mdlurl.value, 
							mdltoken.value,
							mdl_course_id, 
							assg.name, 
							assg.name);

						/* Actualizo el syncDetail con el grupo de moodle */
						await I_SyncDetail.update(
							{mdl_group_id: mdlgroup.id},
							{
								where: {I_SyncDetail_id: detail.I_SyncDetail_id}, 
								fields: ['mdl_group_id']
							})

						mdl_group_id = mdlgroup.id;
					}

					createUsersInMoodle(
						siuurl.value + '/' + assg.siu_assignment_code + '/alumnos?limit=9999', 
						siutoken.value, 
						mdlurl.value, 
						mdltoken.value, 
						fixArray,
						mdl_course_id,
						student_roleid.value,
						mdl_group_id,
						syncup, 
						detail);

					createUsersInMoodle(
						siuurl.value + '/' + assg.siu_assignment_code + '/docentes?limit=9999', 
						siutoken.value, 
						mdlurl.value, 
						mdltoken.value, 
						fixArray,
						mdl_course_id,
						teacher_roleid.value,
						mdl_group_id,
						syncup,
						detail);
				
					if(i === details.length -1){
						let obj = {success: true, msg: 'Se sincronizó todo exitosamente. Consulte el log'};
						res.send(obj);
					}
					
				}
			
			})
			.catch(err => {
				throw err;
			})			
		} catch (err) {
			throw err;
		}
  }
}
