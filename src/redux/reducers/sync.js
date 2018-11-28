const initialState = {
	syncs: [],
};

export default (state = initialState, action) => {
	switch(action.type) {
		case 'SET_SYNCS':
			return {
				...state,
				syncs: action.syncs,
			}
		default:
			return state;
	}
}