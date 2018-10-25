const initialState = {
	activities: [],
};

export default (state = initialState, action) => {
	switch(action.type) {
		case 'SET_ACTIVITIES':
			return {
				...state,
				activities: action.activities,
			}
		default:
			return state;
	}
}