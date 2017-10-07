import React, { Component } from 'react';

export default class Header extends Component {

	constructor(props) {
		super(props);

		this.renderNavButtons = this.renderNavButtons.bind(this);
		this.onLogOut = this.onLogOut.bind(this);
	}

	onLogOut() {
		fetch('http://localhost:3000/api/logout')
			.then(res => res.json())
  		.then(res => {
  			console.log(res);
  			if(res.confirmation === 'success') {
  				this.props.navigateToPage('home');
  				this.props.setIsAuthenticated(false);
  			}
  		});
	}

	renderNavButtons() {
		const { isAuthenticated } = this.props;
		let navButtons;
		// if the user is authenticated render Home, Profile and Logout nav buttons,
		// but if the user is not authenticated render Home, Register and Login buttons
		if(isAuthenticated) {
			navButtons = (
				<nav>
          <ul className="nav nav-pills float-right">
            <li className="nav-item">
              <button type="button" className="btn btn-light" onClick={() => this.props.navigateToPage('home')}>Home</button>
            </li>
						<li className="nav-item">
          		<button type="button" className="btn btn-light" onClick={() => this.props.navigateToPage('profile')}>Profile</button>
        		</li>
        		<li className="nav-item">
          		<button type="button" className="btn btn-light" onClick={() => this.onLogOut()}>Logout</button>
        		</li>
        	</ul>
        </nav>
			);
		} else {
			navButtons = (
				<nav>
          <ul className="nav nav-pills float-right">
            <li className="nav-item">
              <button type="button" className="btn btn-light" onClick={() => this.props.navigateToPage('home')}>Home</button>
            </li>
						<li className="nav-item">
          		<button type="button" className="btn btn-light" onClick={() => this.props.navigateToPage('register')}>Register</button>
        		</li>
        		<li className="nav-item">
          		<button type="button" className="btn btn-light" onClick={() => this.props.navigateToPage('login')}>Login</button>
        		</li>
        	</ul>
        </nav>
			);
		}
		return navButtons;
	}

	render() {
		return(
			<div className="header clearfix">
        {this.renderNavButtons()}
        <h3 className="text-muted">Instrukcije-hr</h3>
        <hr />
      </div>
    );
	}
}