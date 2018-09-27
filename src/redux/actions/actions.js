import axios from 'axios'

//Refresh user data from user ID
export function getUser (userID) {
      return (dispatch) => {
        axios.get('/api/users/'+userID)
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

export function loginUser (user,password) {

      return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})
        console.log('Start login');

        axios.post('/api/login', {
		    username: user,
		    password:password
		  })
		  .then(function (response) {
		  	console.log(response.headers["set-cookie"] )
		  	if (response.data)
	    		dispatch({type: 'SET_USER', userData:response.data})
	    	else
	    		dispatch({type: 'LOGIN_FAIL', error:response.msg})
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

        axios.get('/api/configs')
		  .then(function (response) {
		  	if (response.data)
	    		dispatch({type: 'SET_CONFIGURATIONS', configuration:response.data})
	    	else
	    		console.log("error",response.msg)
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
      	/*dispatch({type: 'SET_APP_LOADING'})
        console.log('Start save configurations');

        axios.post(url+'configs',{data: configurations})
		  .then(function (response) {
		  	console.log(response);
		  	if (response.data)
	    		dispatch({type: 'SET_CONFIGURATIONS', configuration:configurations})
	    	else
	    		console.log("error",response.msg)
		  })
		  .catch(function (error) {
		    console.log("error",error.response);
		  })
		  .then(function () {
		    console.log('End save configurations');
	   		dispatch({type: 'UNSET_APP_LOADING'});
		  });  */

		 // TODO: Not need to update, not used by front end.
		dispatch({type: 'UPDATE_CONFIGURATIONS', configurations})
	}
}