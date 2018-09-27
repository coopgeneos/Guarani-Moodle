const initialState = {
	configurations: [],
};

export default (state = initialState, action) => {
	switch(action.type) {
		case 'SET_CONFIGURATIONS':
			return {
				...state,
				configurations: action.configuration,

			}
		case 'UPDATE_CONFIGURATIONS':
			var actualConfigurations = state.configurations.slice();
			var newConfigurations = action.configurations;

			for (var i=0 ; i < actualConfigurations.length ; i++) {
				if ( newConfigurations.hasOwnProperty(actualConfigurations[i].key) )
					actualConfigurations[i].value = newConfigurations[actualConfigurations[i].key]
			}
			return {
				...state,
				configurations: actualConfigurations,

			}
		default:
			return state;
	}
}