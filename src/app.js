import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import Header from './components/header';
import Body from './components/body';
import store from './store';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			isAuthenticated: false,
			currentPage: 'home', 
			user: {},
			userProfile: {},
			homePage: 'home',
		};

		this.navigateToPage = this.navigateToPage.bind(this);
		this.setIsAuthenticated = this.setIsAuthenticated.bind(this);
		this.logInUser = this.logInUser.bind(this);
		this.changeHomeDisplay = this.changeHomeDisplay.bind(this);
		this.setUserProfile = this.setUserProfile.bind(this);
	}

	navigateToPage(page) {
		this.setState({ currentPage: page });
	}

	changeHomeDisplay(value) {
		this.setState({ homePage: value });
	}

	setUserProfile(profile) {
		this.setState({ userProfile: profile });
	}

	setIsAuthenticated(value) {
		this.setState({ isAuthenticated: value });
	}

	logInUser(user) {
		this.setState({ user: user });
	}

	render() {
		console.log(this.state);
		return (
			<div>
			 	<Header 
					isAuthenticated={this.state.isAuthenticated} 
					setIsAuthenticated={this.setIsAuthenticated}
					navigateToPage={this.navigateToPage}
					setUserProfile={this.setUserProfile}
					changeHomeDisplay={this.changeHomeDisplay}
				/>
				<Route path="/registracija" component={() => <div>REGISTRACIJA</div>} />

				<Body 
					homePage={this.state.homePage}
					userProfile={this.state.userProfile}
					setUserProfile={this.setUserProfile}
					changeHomeDisplay={this.changeHomeDisplay}
					currentPage={this.state.currentPage} 
					navigateToPage={this.navigateToPage}
					setIsAuthenticated={this.setIsAuthenticated}
					logInUser={this.logInUser}
					user={this.state.user}
				/>
			</div>	
		);
	}
}

ReactDOM.render(<Provider store={store.configure(null)}><BrowserRouter><App /></BrowserRouter></Provider>, document.getElementById('root'));