import axios from 'axios'
const url = 'http://localhost:5000/'

//Refresh user data from user ID
export function getUser (userID) {
      return (dispatch) => {
        axios.get(url+'users/'+userID)
		  .then(function (response) {
		  	console.log(response);
		  	if (response.data.success)
	    		dispatch({type: 'SET_USER', userData:response.data.data})
	    	else
	    		dispatch({type: 'LOGIN_FAIL', error:response.data.msg})
	    	console.log('Aca se rompe todo!');
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

        axios.post(url+'login', {
		    username: user,
		    password:password
		  })
		  .then(function (response) {
		  	console.log(response);
		  	if (response.data.success)
		  		
	    		dispatch({type: 'SET_USER', userData:response.data.data})
	    	else
	    		dispatch({type: 'LOGIN_FAIL', error:response.data.msg})
		  })
		  .catch(function (error) {
		  	dispatch({type: 'LOGIN_FAIL', error:error})
		    console.log("error",error);
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

      	//Emulates data load
	    var data = 
	    	[
	    	{key:"key", value:"value", description:"description", name:"name"},
	    	{key:"key", value:"value", description:"description", name:"name"},
	    	{key:"key", value:"value", description:"description", name:"name"},
	    	{key:"key", value:"value", description:"description", name:"name"},
	    	{key:"key", value:"value", description:"description", name:"name"},
	    	{key:"key", value:"value", description:"description", name:"name"},
	    	{key:"key", value:"value", description:"description", name:"name"},
	    	];

      	//Emulates logout
	   	setTimeout(function() {
	   		dispatch({type: 'LOAD_CONFIGURATIONS',configuration: data})
	   		dispatch({type: 'UNSET_APP_LOADING'});
	   	},2000);

	  }
	
}