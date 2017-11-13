import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import HeaderComponent from './components/headerComponent';
import HomeComponent from './components/homeComponent';
import ProfileComponent from './components/profileComponent';
import RegisterComponent from './components/registerComponent';
import LoginComponent from './components/loginComponent';
import SettingsComponent from'./components/settingsComponent';
import store from './store';

class App extends Component {

	render() {
		return (
			<div>
			 	<HeaderComponent />
			 	<Route exact path="/" render={(props) => <HomeComponent {...props} />} />
				<Route exact path="/:page" render={(props) => <HomeComponent {...props} currentPage={props.match.params.page}/>} />
				<Route exact path="/profil" render={(props) => <ProfileComponent {...props} />} />
				<Route path="/profil/:id" render={(props) => <ProfileComponent {...props} profileId={props.match.params.id} />} />
				<Route path="/registracija" render={(props) => <RegisterComponent {...props} />} />
				<Route path="/prijava" render={(props) => <LoginComponent {...props} />} />
				<Route path="/postavke" render={(props) => <SettingsComponent {...props} />} />
			</div>	
		);
	}
}

ReactDOM.render(
	<Provider store={store.configure(null)}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>, document.getElementById('root'));
