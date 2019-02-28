import axios from 'axios'
import http from 'http'
import https from 'https'
import {store} from '../.././redux/store';
import {NotificationManager} from 'react-notifications';

let url = 'http://localhost:5000/';
axios.defaults.withCredentials = true;

//Refresh user data from user ID
export function getUser (userID) {
      return (dispatch) => {
        axios.get(url+'api/users/'+userID)
		  .then(function (response) {
		  	if (response.data.success)
	    		dispatch({type: 'SET_USER', userData:response.data.data})
	    	else
	    		dispatch({type: 'LOGIN_FAIL', error:response.data.msg})
		  })
		  .catch(function (error) {
		  	//If fails then unset!
		  	dispatch({type: 'UNSET_USER'})
		    console.log("error",error.response);
		  }) 

	  }	    
	
}

export function updateUser (user) {

      return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})

        axios.put(url+'api/users/'+user.I_User_id, {user})
		  .then(function (response) {
		  	if (response.data)
	    		dispatch({type: 'UPDATE_USER', userData:user})
		  })
		  .catch(function (error) {
		    console.log("error",error.response);
		  })
		  .then(function () {
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	  }
	
}

export function loginUser (user,password) {

      return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})

        axios.post(url+'api/login', {
		    username: user,
		    password:password
		  })
		  .then(function (response) {
		  	if (response.data.data)
	    		dispatch({type: 'SET_USER', userData:response.data.data})
	    	else {
				NotificationManager.error(response.data.msg, 'Error');
	    	}
		  })
		  .catch(function (error) {
		  	NotificationManager.error('No hay conección','Error');
		    console.log("error",error.response);
		  })
		  .then(function () {
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	  }
	
}

export function logoutUser () {

      return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})

      	//Emulates logout
	   	setTimeout(function() {
	   		dispatch({type: 'UNSET_USER'})
	   		dispatch({type: 'UNSET_APP_LOADING'});
	   	},2000);

	  }
	
}

export function loadConfigurations () {
	 
   	return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})

        axios.get(url+'api/configs')
		  .then(function (response) {
		  	if (response.data.data)
	    		dispatch({type: 'SET_CONFIGURATIONS', configuration:response.data.data})
	    	else
	    		console.log("error",response.data.msg)
		  })
		  .catch(function (error) {
		    console.log("error",error.response);
		  })
		  .then(function () {
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	}
}

export function saveConfigurations (configurations) {
   	return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})


        //Transforms configurations
        let configurationsRequest = [];
        for (var property in configurations) {
			configurationsRequest.push({
										key:[property],
										value:configurations[property]
										});
		}

        axios.put(url+'api/configs',configurationsRequest)
		  .then(function (response) {
		  	if (response.data.success)
				dispatch({type: 'UPDATE_CONFIGURATIONS', configurations})
	    	else
	    		console.log("error",response.data.msg)
		  })
		  .catch(function (error) {
		    console.log("error",error.response);
		  })
		  .then(function () {
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  }); 
	}
}

export function loadPeriods () {
	 
   	return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})

        axios.get(url+'api/periods')
		  .then(function (response) {
		  	if (response.data.data)
	    		dispatch({type: 'SET_PERIODS', periods:response.data.data})
	    	else
	    		console.log("error",response.data.msg)
		  })
		  .catch(function (error) {
		    console.log("error",error.response);
		  })
		  .then(function () {
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	}
}

export function loadActivities (C_SIU_School_Period_ID) {
	 
   	return (dispatch) => {
   		if (C_SIU_School_Period_ID == -1){
   			dispatch({type: 'SET_ACTIVITIES', activities:[]})
   			return
   		}

      	dispatch({type: 'SET_APP_LOADING'})

        axios.get(url+'api/activities/period/'+C_SIU_School_Period_ID)
		  .then(function (response) {
		  	if (response.data.data)
	    		dispatch({type: 'SET_ACTIVITIES', activities:response.data.data})
	    	else
	    		console.log("error",response.data.msg)
		  })
		  .catch(function (error) {
		    console.log("error",error.response);
		  })
		  .then(function () {
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	}
}

export function refreshActivities (C_SIU_School_Period_ID) {
	 
   	return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})

        axios.put(url+'api/activities')
		  .then(function (response) {
		  	if (response.data.success){
	    		store.dispatch(loadActivities(C_SIU_School_Period_ID));
	    		NotificationManager.success('Se actualizó la información de actividades correctamente', '¡Exito!');
	    	}
	    	else
		    	NotificationManager.error('Error actualizar actividades: '+response.data.msg,'Error');
		  	})
	  	.catch(function (error) {
	  		NotificationManager.error('No hay conección','Error');
	    	console.log("error",error.response);
	  	})
		  .then(function () {
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	}
}

export function createSync (assignments, newSync,C_SIU_School_Period_ID) {
	return (dispatch) => {
		dispatch({type: 'SET_APP_LOADING'})

	    var sync = {"name":newSync.syncName,
	    			"code":newSync.syncCode,
	    			"i_syncCategory_id":newSync.syncCategory,
	    			"c_siu_school_period_id":C_SIU_School_Period_ID,
	    			"sync_type":"0","status":"AP","Details":[]}

	    assignments.forEach((item,index) => {
	    	sync.Details.push({"siu_assignment_code":item});
	    })

	    axios
	    .post(url+'api/syncs', sync)
		.then(function (response) {
		  	if (response.data.success == true){
	    		dispatch({type: 'CLOSE_ACTIVITIES_CREATESYNC_POPUP'});
		    	NotificationManager.success('Sincronización creada: '+newSync.syncName, '¡Exito!');
		  	}
	    	else
	    		NotificationManager.error('Error al crear Sincronización: '+response.data.msg, '¡Error!');
	  	})
	  	.catch(function (error) {
	    	NotificationManager.error('Error de coneccion', '¡Error!');
	  	})
	  	.then(function () {
   			dispatch({type: 'UNSET_APP_LOADING'});
	  	});  
	}
}

export function loadSyncs () {
	 
   	return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})

        axios.get(url+'api/syncs',{query:"1=1"})
		  .then(function (response) {
		  	if (response.data.data)
	    		dispatch({type: 'SET_SYNCS', syncs:response.data.data})
	    	else
	    		console.log("error",response.data.msg)
		  })
		  .catch(function (error) {
		    console.log("error",error.response);
		  })
		  .then(function () {
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	}
}

export function addAssignments (assignments, i_sync_id) {
	return (dispatch) => {
		dispatch({type: 'SET_APP_LOADING'})

		let details = [];

	    assignments.forEach((item,index) => {
	    	details.push({"siu_assignment_code":item});
	    })

	    axios
	    .put(url+'api/syncs/'+i_sync_id+'/addAssignments', details)
		.then(function (response) {
		  	if (response.data.success == true){
	    		dispatch({type: 'CLOSE_ACTIVITIES_ADDASSIGNMENTS_POPUP'});
		    	NotificationManager.success(response.data.msg, '¡Exito!');
		  	}
	    	else
	    		NotificationManager.error('Error al agregar comisiones: '+response.data.msg, '¡Error!');
	  	})
	  	.catch(function (error) {
	    	NotificationManager.error('Error de coneccion', '¡Error!');
	  	})
	  	.then(function () {
   			dispatch({type: 'UNSET_APP_LOADING'});
	  	});  
	}
}

export function deleteAssigment (assignment) {
	return (dispatch) => {
		dispatch({type: 'SET_APP_LOADING'})

	    axios
	    .delete(url+'api/syncs/deleteDetail/'+assignment)
		.then(function (response) {
		  	if (response.data.success == true){
		  		store.dispatch(loadSyncs());
		    	NotificationManager.success(response.data.msg, '¡Exito!');
		  	}
	    	else
	    		NotificationManager.error('Error al eliminar comision: '+response.data.msg, '¡Error!');
	  	})
	  	.catch(function (error) {
	    	NotificationManager.error('Error de coneccion', '¡Error!');
	  	})
	  	.then(function () {
   			dispatch({type: 'UNSET_APP_LOADING'});
	  	});  
	}
}

/*
* La sincronizacion se ejecuta en 2do plano debido a que tarda mucho tiempo.
* Lo ideal seria implementar websockets para manterner comunicado Cliente-Servidor pero lo dejamos para la version 2.0
*/
export function doSyncUp (I_Sync_ID,timeout) {
	return (dispatch) => {

		//dispatch({type: 'SET_DOING_SYNCUP', I_Sync_ID:I_Sync_ID})

	   	axios
	    .post(url+'api/syncUp/'+I_Sync_ID)
		.then(function (response) {
		  	if (response.data.success)
		  		NotificationManager.success('La sincronización de: '+response.data.name+' se esta ejecutando en segundo plano. Puede revisar los logs cuando lo desee', 'Comenzo la sincronizació');
	    	else
	    		NotificationManager.error(response.data.msg,'Error');
	  	})
	  	.catch(function (error) {
	  		NotificationManager.error('No hay conección','Error');
	    	console.log("error",error.response);
	  	})
	  	.then(function () {
			//dispatch({type: 'UNSET_DOING_SYNCUP', I_Sync_ID:I_Sync_ID})
	  	});  

	}
}

export function saveSyncConfig (syncConfig) {
	return (dispatch) => {
		dispatch({type: 'SET_APP_LOADING'})

	    let aux = {"task_periodicity":syncConfig.task_periodicity,
	    		   "task_from":syncConfig.task_from != null ? syncConfig.task_from.getTime() : null,
	    		   "task_to":syncConfig.task_to != null ? syncConfig.task_to.getTime() : null,
	    		   "task_student":syncConfig.task_student,
	    		   "task_teacher":syncConfig.task_teacher}
	    
    	axios
	    .put(url+'api/syncs/'+syncConfig.I_Sync_id, aux)
		.then(function (response) {
		  	if (response.data.success){
	    		dispatch({type: 'CLOSE_SYNCCONFIG_POPUP'});
	    		NotificationManager.success('Sincronización actualizada: '+syncConfig.name, '¡Exito!');
	    	}
	    	else{
	    		NotificationManager.error('Error al actualizar sincronización: '+response.data.msg,'Error');
	    	}
	  	})
	  	.catch(function (error) {
	  		NotificationManager.error('No hay conección','Error');
	    	console.log("error",error.response);
	  	})
	  	.then(function () {
   			dispatch({type: 'UNSET_APP_LOADING'});
	  	});
	}
}

export function loadSyncLogs (I_Sync_ID) {
	 
   	return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})

        axios.get(url+'api/syncUp/'+I_Sync_ID,{})
		  .then(function (response) {
		  	if (response.data.data)
	    		dispatch({type: 'SET_SYNCS_LOGS', logs:response.data.data})
	    	else
	    		console.log("error",response.data.msg)
		  })
		  .catch(function (error) {
		    console.log("error",error.response);
		  })
		  .then(function () {
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	}
}

export function loadCategories () {
	 
   	return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})

        axios.get(url+'api/syncCategories',{})
		  .then(function (response) {
		  	if (response.data.data)
	    		dispatch({type: 'SET_CATEGORIES', categories:response.data.data})
	    	else
	    		console.log("error",response.data.msg)
		  })
		  .catch(function (error) {
		    console.log("error",error.response);
		  })
		  .then(function () {
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	}
}

export function createCategory (category) {
	return (dispatch) => {
		dispatch({type: 'SET_APP_LOADING'})
	    let aux = {"mdl_category_id":category.newCategory_id,"name":category.newCategory_name}
	    

	    if (typeof category.I_SyncCategory_id !== 'undefined' && category.I_SyncCategory_id != 0){
	    	axios
		    .put(url+'api/syncCategories/'+category.I_SyncCategory_id, aux)
			.then(function (response) {
			  	if (response.data.success){
		    		store.dispatch(loadCategories());
		    		dispatch({type: 'CLOSE_CATEGORIES_POPUP'});
		    		NotificationManager.success('Categoría editada: '+category.newCategory_name, '¡Exito!');
		    	}
		    	else{
		    		NotificationManager.error('Error al editar la categoria: '+response.data.msg,'Error');
		    	}
		  	})
		  	.catch(function (error) {
		  		NotificationManager.error('No hay conección','Error');
		    	console.log("error",error.response);
		  	})
		  	.then(function () {
	   			dispatch({type: 'UNSET_APP_LOADING'});
		  	});
	    }
	    
	    else {
		    axios
		    .post(url+'api/syncCategories', aux)
			.then(function (response) {
			  	if (response.data.success){
		    		store.dispatch(loadCategories());
		    		dispatch({type: 'CLOSE_CATEGORIES_POPUP'});
		    		NotificationManager.success('Nueva categoría creada: '+category.newCategory_name, '¡Exito!');
		    	}
		    	else{
		    		NotificationManager.error('Error al crear la categoria: '+response.data.msg,'Error');
		    	}
		  	})
		  	.catch(function (error) {
		  		NotificationManager.error('Error', 'No hay conección');
		    	console.log("error",error.response);
		  	})
		  	.then(function () {
	   			dispatch({type: 'UNSET_APP_LOADING'});
		  	});
		} 
	}
}

export function loadCohorts () {
	 
   	return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})

        axios.get(url+'api/syncCohorts',{})
		  .then(function (response) {
		  	if (response.data.data)
	    		dispatch({type: 'SET_COHORTS', cohorts:response.data.data})
	    	else
	    		console.log("error",response.data.msg)
		  })
		  .catch(function (error) {
		    console.log("error",error.response);
		  })
		  .then(function () {
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	}
}

export function createCohort (cohort) {
	return (dispatch) => {
		dispatch({type: 'SET_APP_LOADING'})
	    let aux = {"mdl_cohort_id":cohort.newCohort_id,"name":cohort.newCohort_name}
	 

	    if (typeof cohort.I_SyncCohort_id !== 'undefined' && cohort.I_SyncCohort_id != 0){
	    	axios
		    .put(url+'api/syncCohorts/'+cohort.I_SyncCohort_id, aux)
			.then(function (response) {
			  	if (response.data.success){
		    		store.dispatch(loadCohorts());
		    		dispatch({type: 'CLOSE_COHORTS_POPUP'});
		    		NotificationManager.success('Cohorte editada: '+cohort.newCohort_name, '¡Exito!');
		    	}
		    	else{
		    		NotificationManager.error('Error al editar la cohorte: '+response.data.msg,'Error');
		    	}
		  	})
		  	.catch(function (error) {
		  		NotificationManager.error('Error', 'No hay conección');
		    	console.log("error",error.response);
		  	})
		  	.then(function () {
	   			dispatch({type: 'UNSET_APP_LOADING'});
		  	});
	    }
	    
	    else {
		    axios
		    .post(url+'api/syncCohorts', aux)
			.then(function (response) {
			  	if (response.data.success){
		    		store.dispatch(loadCohorts());
		    		dispatch({type: 'CLOSE_COHORTS_POPUP'});
		    		NotificationManager.success('Nueva cohorte creada: '+cohort.newCohort_name, '¡Exito!');
		    	}
		    	else{
		    		NotificationManager.error('Error al crear la cohorte: '+response.data.msg,'Error');
		    	}
		  	})
		  	.catch(function (error) {
		  		NotificationManager.error('Error', 'No hay conección');
		    	console.log("error",error.response);
		  	})
		  	.then(function () {
	   			dispatch({type: 'UNSET_APP_LOADING'});
		  	});
		} 
	}
}

export function loadSyncDetailSIU (I_SyncDetail_ID) {
	return (dispatch) => {

		dispatch({type: 'SET_APP_LOADING'})

		axios.get(url+'api/syncDetailSIU/'+I_SyncDetail_ID,{})
		.then(function (response) {
			if (response.data.data){
				dispatch({type: 'SET_SYNCDETAILDATA', detail:response.data.data})
			}
			else {
				NotificationManager.error('Error al obtener DATA de SIU: '+response.data.msg,'Error');
				console.log("error",response.data.msg)
			}
		})
		.catch(function (error) {
			NotificationManager.error('Error', 'No hay conección');
			console.log("error",error.response);
		})
		.then(function () {
			dispatch({type: 'UNSET_APP_LOADING'});
		});  
	}
}

