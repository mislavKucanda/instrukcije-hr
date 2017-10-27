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
		return <HomePage 
			userProfile={this.props.userProfile}
			homePage={this.props.homePage}
			setUserProfile={this.props.setUserProfile}
			changeHomeDisplay={this.props.changeHomeDisplay}
		/>;
	}

	renderUserProfile() {
		return <ProfilePage user={this.props.user} />;
	}

	renderProfile(match) {
		return <ProfilePage user={this.props.user} profileId={match.match.params.id} />;
	}

	renderRegister() {
		return <RegisterPage 
			navigateToPage={this.props.navigateToPage} 
			setIsAuthenticated={this.props.setIsAuthenticated} 
			logInUser={this.props.logInUser} 
		/>;
	}

	renderLogin(props) {
		return <LoginPage
			{...props}
			navigateToPage={this.props.navigateToPage} 
			setIsAuthenticated={this.props.setIsAuthenticated} 
			logInUser={this.props.logInUser} 
		/>;
	}

	render() {
		return(
			<div>
				<Route exact path="/" render={this.renderHome} />
				<Route exact path="/profil" render={this.renderUserProfile} />
				<Route path="/profil/:id" render={(match) => this.renderProfile(match)} />
				<Route path="/registracija" render={this.renderRegister} />
				<Route path="/prijava" render={(props) => this.renderLogin(props)} />
			</div>
		);
	}

}