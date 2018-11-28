const initialState = {
	categories: [],
};

export default (state = initialState, action) => {
	switch(action.type) {
		case 'SET_CATEGORIES':
			return {
				...state,
				categories: action.categories,
			}
		default:
			return state;
	}
}