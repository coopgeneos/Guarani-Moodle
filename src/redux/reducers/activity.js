const initialState = {
	activities: [],
	popup:false
};

export default (state = initialState, action) => {
	switch(action.type) {
		case 'SET_ACTIVITIES':
			return {
				...state,
				//Filter activities without comisions
				activities: action.activities.filter((activity) =>
				activity.C_SIU_Assignments.length > 0),
			}
		case 'CLOSE_ACTIVITIES_CREATESYNC_POPUP':
			return {
				...state,
				popup: false,
			}
		default:
			return state;
	}
}