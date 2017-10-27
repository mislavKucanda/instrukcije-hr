import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import HomePage from './pages/homePage';
import ProfilePage from './pages/profilePage';
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';

export default class Body extends Component {

	constructor(props) {
		super(props);

		this.renderHome = this.renderHome.bind(this);
		this.renderProfile = this.renderProfile.bind(this);
		this.renderRegister = this.renderRegister.bind(this);
		this.renderLogin = this.renderLogin.bind(this);
		this.renderUserProfile = this.renderUserProfile.bind(this);
	}

	renderHome() {
		return <HomePage />;
	}

	renderUserProfile() {
		return <ProfilePage />;
	}

	renderProfile(match) {
		return <ProfilePage profileId={match.match.params.id} />;
	}

	renderRegister(props) {
		return <RegisterPage {...props} />;
	}

	renderLogin(props) {
		return <LoginPage {...props} />;
	}

	render() {
		return(
			<div>
				<Route exact path="/" render={this.renderHome} />
				<Route exact path="/profil" render={this.renderUserProfile} />
				<Route path="/profil/:id" render={(match) => this.renderProfile(match)} />
				<Route path="/registracija" render={(props) => this.renderRegister(props)} />
				<Route path="/prijava" render={(props) => this.renderLogin(props)} />
			</div>
		);
	}

}