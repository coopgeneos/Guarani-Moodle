const initialState = {
	syncs: [],
	popupConfig:false
};

export default (state = initialState, action) => {
	switch(action.type) {
		case 'SET_SYNCS':
			return {
				...state,
				syncs: action.syncs,
			}
		case 'SET_DOING_SYNC':
			var syncs = state.syncs;
			for (var i = 0 ; i < state.syncs.lenght ; i++){
				if (syncs[i].I_Sync_id == action.I_Sync_ID)
					syncs[i].loading = 1;
			}
			return {
				...state,
				syncs: syncs,
			}
		case 'UNSET_DOING_SYNC':
			var syncs = state.syncs;
			for (var i = 0 ; i < state.syncs.lenght ; i++){
				if (syncs[i].I_Sync_id == action.I_Sync_ID)
					syncs[i].loading = 0;
			}
			return {
				...state,
				syncs: syncs,
			}
		case 'CLOSE_SYNCCONFIG_POPUP':
			return {
				...state,
				popupConfig: false,
			}
		default:
			return state;
	}
}