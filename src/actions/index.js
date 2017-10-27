import constant from '../constants';

export default {

	getAllProfiles: (profiles) => {
		return {
			type: constant.GET_ALL_PROFILES,
			data: profiles,
		};
	},

};