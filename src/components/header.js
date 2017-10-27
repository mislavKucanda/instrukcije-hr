import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import Const from '../../const';

export default class Header extends Component {

	constructor(props) {
		super(props);

    this.state = {
      hooveredElement: '',
    }

		this.renderNavButtons = this.renderNavButtons.bind(this);
    this.onHooverElement = this.onHooverElement.bind(this);
    this.onStopHooverElement = this.onStopHooverElement.bind(this);
		this.onLogOut = this.onLogOut.bind(this);
	}

	onLogOut() {
		fetch('http://localhost:3000/api/logout')
			.then(res => res.json())
  		.then(res => {
  			console.log(res);
  			if(res.confirmation === 'success') {
  				this.props.setIsAuthenticated(false);
  			}
  		});
	}

  onHooverElement(elem, label) {
    this.setState({ hooveredElement: label });
  }

  onStopHooverElement() {
    this.setState({ hooveredElement: '' });
  }

	renderNavButtons() {
    const { isAuthenticated } = this.props;
    const { hooveredElement } = this.state;
    const {
      homeNavUrl,
      registerNavUrl,
      profilNavUrl,
      logoutNavUrl,
      loginNavUrl,
    } = Const;

    let navButtons;
    // if the user is authenticated render Home, Profile and Logout nav buttons,
    // but if the user is not authenticated render Home, Register and Login buttons
    if(isAuthenticated) {
      navButtons = (
        <div className='float-right'>
          <Link to="/">
            <img 
              src={homeNavUrl}
              style={{ width: 60, height: 60, backgroundColor: hooveredElement === 'home' ? '#5c9b8e' : null }} 
              onMouseOver={(elem) => this.onHooverElement(elem, 'home')} 
              onMouseOut={this.onStopHooverElement}
            />
          </Link>
          <Link to="/profil">
            <img 
              src={profilNavUrl} 
              style={{ width: 60, height: 60, backgroundColor: hooveredElement === 'profile' ? '#5c9b8e' : null }}
              onMouseOver={(elem) => this.onHooverElement(elem, 'profile')}
              onMouseOut={this.onStopHooverElement}
            />
          </Link>
          <Link to="/">
            <img 
              src={logoutNavUrl} 
              onClick={() => this.onLogOut()} 
              style={{ width: 60, height: 60, backgroundColor: hooveredElement === 'logout' ? '#5c9b8e' : null }}
              onMouseOver={(elem) => this.onHooverElement(elem, 'logout')}
              onMouseOut={this.onStopHooverElement}
            />
          </Link>
        </div>
      );
    } else {
      navButtons = (
        <div className='float-right'>
          <Link to="/">
            <img 
              src={homeNavUrl}
              style={{ width: 60, height: 60, backgroundColor: hooveredElement === 'home' ? '#5c9b8e' : null }} 
              onMouseOver={(elem) => this.onHooverElement(elem, 'home')}
              onMouseOut={this.onStopHooverElement}
            />
          </Link>
          <Link to="/registracija">
            <img 
              src={registerNavUrl}
              style={{ width: 60, height: 60, backgroundColor: hooveredElement === 'register' ? '#5c9b8e' : null }} 
              onMouseOver={(elem) => this.onHooverElement(elem, 'register')}
              onMouseOut={this.onStopHooverElement}
            />
          </Link>
          <Link to="/prijava">
            <img 
              src={loginNavUrl}
              style={{ width: 60, height: 60, backgroundColor: hooveredElement === 'login' ? '#5c9b8e' : null }} 
              onMouseOver={(elem) => this.onHooverElement(elem, 'login')}
              onMouseOut={this.onStopHooverElement}
            />
          </Link>
        </div>
      );
    }
    return navButtons;
  }

	render() {
		return(
			<div className="header clearfix" style={{ backgroundColor: '#36B39C'}}>
        <div>
        {this.renderNavButtons()}
        <img src={Const.logoUrl} style={{ hight: 60, width: 300 }} />
        </div>
      </div>
    );
	}
}
