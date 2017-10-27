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
			user: {},
		};

		this.setIsAuthenticated = this.setIsAuthenticated.bind(this);
		this.logInUser = this.logInUser.bind(this);
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
				/>
				<Route path="/registracija" component={() => <div>REGISTRACIJA</div>} />

				<Body
					setIsAuthenticated={this.setIsAuthenticated}
					logInUser={this.logInUser}
					user={this.state.user}
				/>
			</div>	
		);
	}
}

ReactDOM.render(<Provider store={store.configure(null)}><BrowserRouter><App /></BrowserRouter></Provider>, document.getElementById('root'));