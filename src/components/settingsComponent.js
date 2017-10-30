import React, { Component } from 'react';
import { connect } from 'react-redux';


class SettingsComponent extends Component {

	componentDidMount() {
		const { user } = this.props;
		// if user is not logged in, redirect to log in page
		if(Object.getOwnPropertyNames(user).length === 0)
			this.props.history.push("/prijava");
	}

	render(){
		return <div>{this.props.user.username}</div>
	}
}

const stateToProps = (state) => {
	return {
		user: state.profiles.user,
	};
};

export default connect(stateToProps)(SettingsComponent);