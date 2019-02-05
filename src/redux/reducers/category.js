const initialState = {
	categories: [],
	popup:false,
};

export default (state = initialState, action) => {
	switch(action.type) {
		case 'SET_CATEGORIES':
			return {
				...state,
				categories: action.categories,
			}
		case 'CLOSE_CATEGORIES_POPUP':
			return {
				...state,
				popup: false,
			}
		default:
			return state;
	}
}