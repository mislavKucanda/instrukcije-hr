import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import actions from '../actions';

class LoginComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			errorMessage: '',
		}

		this.onChangeUsername = this.onChangeUsername.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.renderWarning = this.renderWarning.bind(this);
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
		if(!this.state.username) {
			this.setState({ errorMessage: 'Molim vas da unesete korisničko ime.' });
			return;
		}
		if(!this.state.password) {
			this.setState({ errorMessage: 'Molim vas da unesete lozinku.' });
			return;
		}
		fetch('http://localhost:3000/api/login', {
 			method: 'post',
  		headers: {
    		'Accept': 'application/json, text/plain, */*',
    		'Content-Type': 'application/json',
  		},
  		credentials: 'include',
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
  		} else {
  			console.log(res);
  			this.setState({ errorMessage: res.result });
  		}
  	});
	}

	renderWarning() {
		if(this.state.errorMessage) {
			return (
				<div className="alert alert-warning mt-3 mb-0" role="alert">
  				<strong>Upozorenje!</strong> {this.state.errorMessage}
				</div>
			);
		} else {
			return null;
		}
	}

	render() {
		return (
			<div className="container">
				{this.renderWarning()}
				<form className="mt-3" action="/api/login" method="POST" onSubmit={this.onSubmit}>
				  <div className="form-group">
				  	<label style={{ color: 'black' }}>Korisničko ime</label>
				  	<input type="text" name="username" className="form-control" value={this.state.username} placeholder="Username" onChange={this.onChangeUsername} />
				  </div>
				  <div className="form-group">
				  	<label style={{ color: 'black' }}>Lozinka</label>
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

export default connect(stateToProps, dispatchToProps)(LoginComponent);