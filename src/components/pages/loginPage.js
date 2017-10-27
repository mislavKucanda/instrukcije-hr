import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import actions from '../../actions';

class LoginPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
		}

		this.onChangeUsername = this.onChangeUsername.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChangeUsername(event) {
		this.setState({ username: event.target.value });
	}

	onChangePassword(event) {
		this.setState({ password: event.target.value });
	}

	onSubmit(event) {
		console.log(this.state);
		event.preventDefault();
		fetch('http://localhost:3000/api/login', {
 			method: 'post',
  		headers: {
    		'Accept': 'application/json, text/plain, */*',
    		'Content-Type': 'application/json'
  		},
  		body: JSON.stringify({
  			username: this.state.username,
		  	password: this.state.password,
  		})
		}).then(res => res.json())
  	.then(res => {
  		console.log(res);
  		if(res.confirmation === 'success') {
  			this.props.logInUser(res.result);
  			console.log(this.props.user);
  			this.props.history.push("/profil");
  		}
  	});
	}

	render() {
		return (
			<div className="container">
				<form action="/api/login" method="POST" onSubmit={this.onSubmit}>
				  <div className="form-group">
				  	<label style={{ color: 'white' }}>Username</label>
				  	<input type="text" name="username" className="form-control" value={this.state.username} placeholder="Username" onChange={this.onChangeUsername} />
				  </div>
				  <div className="form-group">
				  	<label style={{ color: 'white' }}>Password</label>
				  	<input type="password" name="password" className="form-control" value={this.state.password} placeholder="Enter password" onChange={this.onChangePassword} />
				  </div>
				  <input type="submit" className="btn btn-primary" value="Submit" />
				</form>
			</div>
		);	
	}
}

const stateToProps = (state) => {
	return {
		user: state.profiles.user
	};
};

const dispatchToProps = (dispatch) => {
	return {
		logInUser: (user) => dispatch(actions.logInUser(user)),
	}
};

export default connect(stateToProps, dispatchToProps)(LoginPage);