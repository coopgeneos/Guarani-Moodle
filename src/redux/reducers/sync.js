const initialState = {
	syncs: [],
	logs: [],
	syncDetail:{docentes:[],alumnos:[]},
	popupConfig:false,
	popupLogs:false,
	popupDetail:false,
	popupBulkConfig:false,
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
		case 'CLOSE_SYNCBULKCONFIG_POPUP':
			return {
				...state,
				popupBulkConfig: false,
			}
		case 'SET_SYNCS_LOGS':
			return {
				...state,
				logs: action.logs,
				popupLogs: true,
			}
		case 'CLOSE_SYNCS_LOGS':
			return {
				...state,
				popupLogs: false,
			}
		case 'SET_SYNCDETAILDATA':
			return {
				...state,
				syncDetail: action.detail,
				popupDetail: true,
      }
    case 'CLOSE_SYNCDETAILDATA':
      console.log('Cierro Details (action)');

			return {
        ...state,
				popupDetail: false,
			}
		default:
			return state;
	}
}