const initialState = {
	appLoading: 0,
	message: 0,
	periods: [],
};

export default (state = initialState, action) => {
	switch(action.type) {
		case 'SET_APP_LOADING':
			return {
				...state,
				appLoading: state.appLoading + 1

			}
		case 'UNSET_APP_LOADING':
			return {
				...state,
				appLoading: state.appLoading - 1

			}
		case 'SET_APP_MESSAGE':
			return {
				...state,
				message: state.message,

			}
		case 'SET_PERIODS':
			return {
				...state,
				periods: action.periods
			}
		default:
			return state;
	}
}