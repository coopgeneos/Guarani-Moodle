const initialState = {
	configurations: [],
};

export default (state = initialState, action) => {
	switch(action.type) {
		case 'LOAD_CONFIGURATIONS':
			return {
				...state,
				configurations: action.configuration,

			}
		default:
			return state;
	}
}