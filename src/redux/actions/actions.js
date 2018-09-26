import axios from 'axios'

//Refresh user data from token
export function getUser (token) {

      return (dispatch) => {

    	var userData = {name:"Usuario", token:'12345678'}
    	dispatch({type: 'SET_USER', userData})
    	console.log("Sucess");

	  }	    
	
}

export function loginUser (user,password) {

      return (dispatch) => {
      	dispatch({type: 'SET_APP_LOADING'})

        console.log('Start login');

        //Emulates auth
	    var data = {msg: "Exito", success:true} ;

	    if(user !== 'Usuario'){
	    	data.success = false;
	    	data.msg = 'Usuario invalido'
	    }

	    if (password !== 'Password') {
	    	data.success = false;
	    	data.msg = 'Password invalido'
	    }

	    
	   	setTimeout(function() {
	   		if (data.success) {
		    	var userData = {name:"Usuario", token:'12345678'}
		    	dispatch({type: 'SET_USER', userData})
		    	console.log("Sucess");
		    }
		    else {
		    	dispatch({type: 'LOGIN_FAIL', error:data.msg})
		    }

		   	console.log('End login',data);
	   		dispatch({type: 'UNSET_APP_LOADING'});

	   	},2000);
	  }
	
}

export function logoutUser (user,password) {

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