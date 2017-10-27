import constant from '../constants';

var initialState = {
	profiles: [],
	user: {},
	isAuthenticated: false,
}

export default(state = initialState, action) => {
	let newState = Object.assign({}, state);

	switch(action.type) {
		case constant.GET_ALL_PROFILES:
			newState.profiles = action.data;
			return newState;
		case constant.LOG_IN_USER:
			newState.user = action.data;
			newState.isAuthenticated = true;
			return newState;
		case constant.LOG_OUT_USER:
			newState.user = {};
			newState.isAuthenticated = false;
			return newState;

		default:
			return state;
	}
};