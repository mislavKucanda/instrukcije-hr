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
		const profileContactInfo = (
			(profile.address !== '' && profile.address !== null) ||
			(profile.mobilePhone !== '' && profile.mobilePhone !== null) ||
			(profile.email !== '' && profile.email !== null) 
			? (
				<ul className="list-group list-group-flush">
		    	{this.renderProfileInfo(Const.profileLogos.location, profile.address)}
		    	{this.renderProfileInfo(Const.profileLogos.phone, profile.mobilePhone)}
		    	{this.renderProfileInfo(Const.profileLogos.email, profile.email)}
		    </ul>
			) : null);

		const profileInfo = (
			(profile.description !== '' && profile.description !== null) ||
			(profile.username !== '' && profile.username !== null))
			? (
				<div className="card-block p-2">
		      	<h4 className="card-title text-center">{profile.username}</h4>
		      	<p className="card-text">{profile.description}</p>
		    </div>
			) : null;

		return(
			<div className="card">
		    {this.renderProfileImage(profile.imgUrl)}
		  	{profileInfo}
		    {profileContactInfo}
		  </div>
	  );
	}
}