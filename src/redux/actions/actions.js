import axios from 'axios'

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
        configurations
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