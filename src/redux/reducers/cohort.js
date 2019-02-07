const initialState = {
	cohorts: [],
	popup:false,
};

export default (state = initialState, action) => {
	switch(action.type) {
		case 'SET_COHORTS':
			return {
				...state,
				cohorts: action.cohorts,
			}
		case 'CLOSE_COHORTS_POPUP':
			return {
				...state,
				popup: false,
			}
		default:
			return state;
	}
}