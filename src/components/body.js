import React, { Component } from 'react';

import HomePage from './pages/homePage';
import ProfilePage from './pages/profilePage';
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';

export default class Body extends Component {

	constructor(props) {
		super(props);

		this.renderBody = this.renderBody.bind(this);
	}

	renderBody() {
		const { currentPage } = this.props;
		if(currentPage === 'home') {
			return <HomePage />;
		} else if(currentPage === 'profile') {
			return <ProfilePage user={this.props.user} />;
		} else if(currentPage === 'register') {
			return <RegisterPage 
				navigateToPage={this.props.navigateToPage} 
				setIsAuthenticated={this.props.setIsAuthenticated} 
				logInUser={this.props.logInUser} 
			/>;
		} else if(currentPage === 'login') {
			return <LoginPage 
				navigateToPage={this.props.navigateToPage} 
				setIsAuthenticated={this.props.setIsAuthenticated} 
				logInUser={this.props.logInUser} 
			/>;
		}
	}

	render() {
		return(
			<div>
				{this.renderBody()}
			</div>
		);
	}

}