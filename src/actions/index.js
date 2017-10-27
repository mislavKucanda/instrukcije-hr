import constant from '../constants';

export default {

	getAllProfiles: (profiles) => {
		return {
			type: constant.GET_ALL_PROFILES,
			data: profiles,
		};
	},
	logInUser: (user) => {
		return {
			type: constant.LOG_IN_USER,
			data: user,
		};
	},
	logOutUser: () => {
		return {
			type: constant.LOG_OUT_USER,
		};
	}

};