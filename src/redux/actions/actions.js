import axios from 'axios'
import {store} from '../.././redux/store';
import {NotificationManager} from 'react-notifications';

//Refresh user data from user ID
export function getUser (userID) {
      return (dispatch) => {
        axios.get('users/'+userID)
		  .then(function (response) {
		  	console.log(response);
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
        console.log('Start update user');

        axios.put('users/'+user.I_User_id, {user})
		  .then(function (response) {
		  	if (response.data)
	    		dispatch({type: 'UPDATE_USER', userData:user})
		  })
		  .catch(function (error) {
		    console.log("error",error.response);
		  })
		  .then(function () {
		    console.log('End update user');
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	  }
	
}

export function loginUser (user,password) {

      return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})
        console.log('Start login');

        axios.post('login', {
		    username: user,
		    password:password
		  })
		  .then(function (response) {
		  	if (response.data.data)
	    		dispatch({type: 'SET_USER', userData:response.data.data})
	    	else
	    		dispatch({type: 'LOGIN_FAIL', error:response.data.msg})
		  })
		  .catch(function (error) {
		  	dispatch({type: 'LOGIN_FAIL', error:error})
		    console.log("error",error.response);
		  })
		  .then(function () {
		    console.log('End login');
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
        console.log('Start load configurations');

        axios.get('configs')
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
		    console.log('End load configurations');
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	}
}

export function saveConfigurations (configurations) {
   	return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})
        console.log('Start save configurations');


        //Transforms configurations
        let configurationsRequest = [];
        for (var property in configurations) {
			configurationsRequest.push({
										key:[property],
										value:configurations[property]
										});
		}

        axios.put('configs',configurationsRequest)
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
		    console.log('End save configurations');
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  }); 
	}
}

export function loadActivities () {
	 
   	return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})
        console.log('Start load activities');

        axios.get('activities')
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
		    console.log('End load activities');
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	}
}

export function refreshActivities () {
	 
   	return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})
        console.log('Start refresh activities');

        axios.put('activities')
		  .then(function (response) {
		  	if (response.data.success)
	    		store.dispatch(loadActivities());
	    	else
	    		console.log("error",response.data.msg)
		  })
		  .catch(function (error) {
		    console.log("error",error.response);
		  })
		  .then(function () {
		    console.log('End refresh activities');
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	}
}

export function createSync (assignments,MDL_Category_ID,C_SIU_School_Period_ID,name) {
	return (dispatch) => {
		dispatch({type: 'SET_APP_LOADING'})
	    console.log('Start creating Sync',assignments);



	    var sync = {"name":name,
	    			"mdl_category_id":MDL_Category_ID,
	    			"c_siu_school_period_id":C_SIU_School_Period_ID,
	    			"sync_type":"0","status":"AP","Details":[]}

	    			 console.log(sync);

	    assignments.forEach((item,index) => {
	    	sync.Details.push({"siu_assignment_code":item});
	    })

	    axios
	    .post('syncs', sync)
		.then(function (response) {
		  	if (response.data.success)
	    		console.log(response.data)
	    	else
	    		console.log("error",response.data.msg)
	  	})
	  	.catch(function (error) {
	    	console.log("error",error.response);
	  	})
	  	.then(function () {
	    	console.log('End create Sync');
   			dispatch({type: 'UNSET_APP_LOADING'});
	  	});  
	}
}

export function loadSyncs () {
	 
   	return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})
        console.log('Start load syncs');

        axios.get('syncs',{query:"1=1"})
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
		    console.log('End load syncs');
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	}
}

export function doSyncUp (I_Sync_ID) {
	return (dispatch) => {

		dispatch({type: 'SET_DOING_SYNCUP', I_Sync_ID:I_Sync_ID})
	    console.log('Start doing sync up');

	   	axios
	    .post('syncUp/'+I_Sync_ID, {})
		.then(function (response) {
		  	if (response.data.success)
	    		console.log(response.data)
	    	else
	    		console.log("error",response.data.msg)
	  	})
	  	.catch(function (error) {
	    	console.log("error",error.response);
	  	})
	  	.then(function () {
	    	console.log('End doing Sync up');
			dispatch({type: 'UNSET_DOING_SYNCUP', I_Sync_ID:I_Sync_ID})
	  	});  

	}
}

export function loadCategories () {
	 
   	return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})
        console.log('Start load categories');

        axios.get('syncCategories',{})
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
		    console.log('End load categories');
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  
	}
}

export function createCategory (category) {
	return (dispatch) => {
		dispatch({type: 'SET_APP_LOADING'})
	    let aux = {"mdl_category_id":category.newCategory_id,"name":category.newCategory_name}
	    axios
	    .post('syncCategories', aux)
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
