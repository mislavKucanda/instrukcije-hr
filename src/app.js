import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from './components/header';
import Body from './components/body';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			isAuthenticated: false,
			currentPage: 'home', 
			user: {},
		};

		this.navigateToPage = this.navigateToPage.bind(this);
		this.setIsAuthenticated = this.setIsAuthenticated.bind(this);
		this.logInUser = this.logInUser.bind(this);
	}

	navigateToPage(page) {
		this.setState({ currentPage: page });
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
				/>
				<Body 
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

ReactDOM.render(<App />, document.getElementById('root'));