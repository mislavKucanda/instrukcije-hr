import React, { Component } from 'react';
import { connect } from 'react-redux';

class StudentProfileSettings extends Component {
	render() {
		const { user } = this.props;
		return (
			<div>{user.type}</div>
		);
	}
}

const stateToProps = (state) => {
	return {
		user: state.profiles.user,
	};
};

export default connect(stateToProps)(StudentProfileSettings);