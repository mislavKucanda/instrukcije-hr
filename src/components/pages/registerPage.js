import React, { Component } from 'react';

export default class RegisterPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			email: '',
			type: '',
			password: '',
			passwordMatch: '',
		}

		this.onChangeUsername = this.onChangeUsername.bind(this);
		this.onChangeEmail = this.onChangeEmail.bind(this);
		this.onChangeType = this.onChangeType.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.onChangePasswordMatch = this.onChangePasswordMatch.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChangeUsername(event) {
		this.setState({ username: event.target.value });
	}

	onChangeEmail(event) {
		this.setState({ email: event.target.value });
	}

	onChangeType(event) {
		this.setState({ type: event.target.value });
	}

	onChangePassword(event) {
		this.setState({ password: event.target.value });
	}

	onChangePasswordMatch(event) {
		this.setState({ passwordMatch: event.target.value });
	}

	onSubmit(event) {
		console.log(this.state);
		event.preventDefault();
		fetch('http://localhost:3000/api/user', {
 			method: 'post',
  		headers: {
    		'Accept': 'application/json, text/plain, */*',
    		'Content-Type': 'application/json'
  		},
  		body: JSON.stringify({
  			username: this.state.username,
		  	email: this.state.email,
		  	type: this.state.type,
		  	password: this.state.password,
		  	passwordMatch: this.state.passwordMatch,
  		})
		}).then(res => res.json())
  	.then(res => {
  		console.log(res);
  		this.props.navigateToPage('profile');
  		this.props.setIsAuthenticated(true);
  	});
	}

	render() {
		return (
			<div className="container">
				<form action="/api/user" method="POST" onSubmit={this.onSubmit}>
				  <div className="form-group">
				  	<label style={{ color: 'white' }}>Username</label>
				  	<input type="text" name="username" className="form-control" value={this.state.username} placeholder="Username" onChange={this.onChangeUsername} />
				  </div>
				  <div className="form-group">
				  	<label style={{ color: 'white' }}>Email</label>
				  	<input type="email" name="email" className="form-control" value={this.state.email} placeholder="Email" onChange={this.onChangeEmail} />
				  </div>
				  <div className="form-group">
				  	<label style={{ color: 'white' }}>Type</label>
				  	<input type="text" name="type" className="form-control" value={this.state.type} placeholder="Type" onChange={this.onChangeType} />
				  </div>
				  <div className="form-group">
				  	<label style={{ color: 'white' }}>Password</label>
				  	<input type="password" name="password" className="form-control" value={this.state.password} placeholder="Enter password" onChange={this.onChangePassword} />
				  </div>
				  <div className="form-group">
				  	<label style={{ color: 'white' }}>Re-Enter Password</label>
				  	<input type="password" name="passwordMatch" className="form-control" value={this.state.passwordMatch} placeholder="Re-enter password" onChange={this.onChangePasswordMatch} />
				  </div>
				  <input type="submit" className="btn btn-primary" value="Submit" />
				</form>
			</div>
		);	
	}
}