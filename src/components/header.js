import React, { Component } from 'react';

import Const from '../../const';

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
          <img src={homeNavUrl} onClick={() => this.props.navigateToPage('home')} style={{ width: 75, height: 75 }} />
          <img src={profilNavUrl} onClick={() => this.props.navigateToPage('profile')} />
          <img src={logoutNavUrl} onClick={() => this.onLogOut()} />
        </div>
      );
    } else {
      navButtons = (
        <div className='float-right'>
          <img src={homeNavUrl} onClick={() => this.props.navigateToPage('home')} style={{ width: 60, height: 60 }} />
          <img src={registerNavUrl} onClick={() => this.props.navigateToPage('register')} style={{ width: 60, height: 60 }} />
          <img src={loginNavUrl} onClick={() => this.props.navigateToPage('login')} style={{ width: 60, height: 60 }} />
        </div>
      );
    }
    return navButtons;
  }


	render() {
		return(
			<div className="header clearfix" style={{ backgroundColor: '#36B39C'}}>
        <div className="container">
        {this.renderNavButtons()}
        
        </div>
      </div>
    );
	}
}
//<img src={Const.logoUrl} className="py-4" style={{ hight: 32, width: 200 }} />
// <nav>
//           <ul className="nav nav-pills float-right">
//             <li className="nav-item">
//               <button type="button" className="btn btn-light" onClick={() => this.props.navigateToPage('home')}>Home</button>
//             </li>
//             <li className="nav-item">
//               <button type="button" className="btn btn-light" onClick={() => this.props.navigateToPage('register')}>Register</button>
//             </li>
//             <li className="nav-item">
//               <button type="button" className="btn btn-light" onClick={() => this.props.navigateToPage('login')}>Login</button>
//             </li>
//           </ul>
//         </nav>