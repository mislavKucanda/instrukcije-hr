import React, { Component } from 'react';

import Const from '../../../const';

export default class ProfileCard extends Component {

	renderProfileImage(imgUrl) {
		if(imgUrl !== null && imgUrl !== '') {
			return <img className="card-img-top img-fluid" src={imgUrl} alt="" />
		}
		return null;
	}

	renderProfileInfo(iconUrl, info) {
		if (info !== null && info !== '') {
	     return (
		    <li className="list-group-item p-1">
		    	<img src={iconUrl} style={{ width:50, height: 50 }} alt=""/>
		    	<span className="pl-1">{info}</span>
		    </li>
		   );
	  }
	  return null;
	}

	render() {
		const { profile } = this.props;
		return(
			<div className="card mb-3">
		    {this.renderProfileImage(profile.imgUrl)}
		    <div className="card-block p-2">
		      	<h4 className="card-title text-center">{profile.username}</h4>
		      	<p className="card-text">{profile.description}</p>
		    </div>
		    <ul className="list-group list-group-flush">
		    	{this.renderProfileInfo(Const.profileLogos.location, profile.address)}
		    	{this.renderProfileInfo(Const.profileLogos.phone, profile.mobilePhone)}
		    	{this.renderProfileInfo(Const.profileLogos.email, profile.email)}
		    </ul>
		  </div>
	  );
	}
}