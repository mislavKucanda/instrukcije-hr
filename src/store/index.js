import { createStore, combineReducers } from 'redux';
import { profileReducer } from '../reducers';

var store;
export default {

	configure: (initialState) => {
		const reducers = combineReducers({
			profiles: profileReducer
		});

		if (initialState) {
			store = createStore(reducers, initialState);
			return store;
		}

		store = createStore(reducers);
		return store;
	}
};