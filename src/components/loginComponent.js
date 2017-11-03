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
			buttonColor: '#36B39C',
			usernameStyle: '#BFBFBF',
			passwordStyle: '#BFBFBF',
		}

		this.onChangeUsername = this.onChangeUsername.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.onHooverButton = this.onHooverButton.bind(this);
		this.onStopHooverButton = this.onStopHooverButton.bind(this);
		this.onFocusInput = this.onFocusInput.bind(this);
		this.onBlurInput = this.onBlurInput.bind(this);
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

	onHooverButton() {
		this.setState({ buttonColor: '#5c9b8e' });
	}

	onStopHooverButton() {
		this.setState({ buttonColor: '#36B39C' });
	}

	onFocusInput(styleElem) {
		if(styleElem === 'usernameStyle')
			this.setState({ usernameStyle: '#36B39C'  });
		else
			this.setState({ passwordStyle: '#36B39C'  });
	}

	onBlurInput(styleElem) {
		if(styleElem === 'usernameStyle')
			this.setState({ usernameStyle: '#BFBFBF'  });
		else
			this.setState({ passwordStyle: '#BFBFBF'  });
	}

	renderWarning() {
		if(this.state.errorMessage) {
			return (
				<div className="alert alert-warning mb-0" role="alert">
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
				<div className="row mt-5">
					<div className="col-lg-4 col-md-3 col-sm-2 col-xs-1" />
					<div className="col-lg-4 col-md-6 col-sm-8 col-xs-10 mt-5 p-0">
						{this.renderWarning()}
						<form className="mt-4" action="/api/login" method="POST" onSubmit={this.onSubmit}>
						  <div className="form-group mt-3">
						  	<input 
						  		type="text" 
						  		name="username" 
						  		className="form-control" 
						  		style={{ borderColor: this.state.usernameStyle }}
						  		value={this.state.username} 
						  		placeholder="Korisničko ime" 
						  		onChange={this.onChangeUsername} 
						  		onFocus={(elem) => this.onFocusInput('usernameStyle')}
						  		onBlur={(elem) => this.onBlurInput('usernameStyle')}
						  	/>
						  </div>
						  <div className="form-group mt-4">
						  	<input 
						  		type="password" 
						  		name="password" 
						  		className="form-control" 
						  		style={{ borderColor: this.state.passwordStyle }}
						  		value={this.state.password} 
						  		placeholder="Lozinka" 
						  		onChange={this.onChangePassword} 
						  		onFocus={(elem) => this.onFocusInput('passwordStyle')}
						  		onBlur={(elem) => this.onBlurInput('passwordStyle')}
						  	/>
						  </div>
						  <div className="row m-0 mt-4">
						  	<input 
						  		type="submit" 
						  		className="btn btn-success col-12" 
						  		value="Potvrdi" 
						  		style={{ backgroundColor: this.state.buttonColor, borderColor: '#5c9b8e' }}
						  		onMouseOver={this.onHooverButton}
              		onMouseOut={this.onStopHooverButton}
						  	/>	
						  </div>
						</form>
					</div>
					<div className="col-lg-4 h-100 col-md-3 col-sm-2 col-xs-1" />
				</div>
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