const initialState = {
	user: {},
	isAuth: false,
	error: null
};

export default (state = initialState, action) => {
	switch(action.type) {
		case 'SET_USER':
			localStorage.Auth = JSON.stringify(action.userData)
			return {
				...state,
				isAuth: Object.keys(action.userData).length > 0 ? true : false,
				user: action.userData,
			}
		case 'UNSET_USER':
			delete localStorage.Auth;
			return {
				...state,
				isAuth: false,
				user: null,
			}
		case 'LOGIN_FAIL':
			return {
				...state,
				error: action.error,

			}
		default:
			return state;
	}
}