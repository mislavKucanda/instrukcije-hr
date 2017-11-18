import React, { Component } from 'react';
import { connect } from 'react-redux';

import InstruktorProfileSettings from './components/InstruktorProfileSettings';
import StudentProfileSettings from './components/StudentProfileSettings';

class ProfileSettingsComponent extends Component {
	render() {
		const { user } = this.props;
		return <InstruktorProfileSettings />;
	}
}

const stateToProps = (state) => {
	return {
		user: state.profiles.user,
	};
};

export default connect(stateToProps)(ProfileSettingsComponent);