const initialState = {
	appLoading: 0,
};

export default (state = initialState, action) => {
	switch(action.type) {
		case 'SET_APP_LOADING':
			return {
				...state,
				appLoading: state.appLoading + 1

			}
		case 'UNSET_APP_LOADING':
			console.log(state);
			return {
				...state,
				appLoading: state.appLoading - 1

			}
		default:
			return state;
	}
}