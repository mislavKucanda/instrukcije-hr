import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import Header from './components/header';
import Body from './components/body';
import store from './store';

class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
			 	<Header />
				<Body />
			</div>	
		);
	}
}

ReactDOM.render(<Provider store={store.configure(null)}><BrowserRouter><App /></BrowserRouter></Provider>, document.getElementById('root'));