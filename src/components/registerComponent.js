import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Select from 'react-select';
import axios from 'axios';
import { connect } from 'react-redux';

import actions from '../actions';
import Const from '../../const';

class RegisterComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			errorMessages: [],
			username: '',
			email: '',
			type: '',
			password: '',
			passwordMatch: '',
			imgUrl: '',
			description: '',
			address: '',
			mobilePhone: '',
			firstCategory: '',
			secondCategory: '',
		}

		this.onChangeUsername = this.onChangeUsername.bind(this);
		this.onChangeEmail = this.onChangeEmail.bind(this);
		this.onChangeType = this.onChangeType.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.onChangePasswordMatch = this.onChangePasswordMatch.bind(this);
		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.onChangeAddress = this.onChangeAddress.bind(this);
		this.onChangeMobilePhone = this.onChangeMobilePhone.bind(this);
		this.renderCategorySelect = this.renderCategorySelect.bind(this);
		this.onChangeFirstCategory = this.onChangeFirstCategory.bind(this);
		this.onChangeSecondCategory = this.onChangeSecondCategory.bind(this);
		this.renderWarnings = this.renderWarnings.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
	}

	onChangeUsername(event) {
		this.setState({ username: event.target.value });
	}

	onChangeAddress(event) {
		this.setState({ address: event.target.value });
	}

	onChangeMobilePhone(event) {
		this.setState({ mobilePhone: event.target.value });
	}

	onChangeDescription(event) {
		this.setState({ description: event.target.value });
	}

	onChangeEmail(event) {
		this.setState({ email: event.target.value });
	}

	onChangeType(event) {
		this.setState({ type: event.target.value });
	}

	onChangePassword(event) {
		this.setState({ password: event.target.value });
	}

	onChangePasswordMatch(event) {
		this.setState({ passwordMatch: event.target.value });
	}

	onChangeFirstCategory(event) {
		this.setState({ firstCategory: event.value });
		console.log(this.state);
	}

	onChangeSecondCategory(event) {
		this.setState({ secondCategory: event.value });
		console.log(this.state);
	}

	onSubmit(event) {
		console.log(this.state);
		event.preventDefault();
		let categoryArray = [];
		if(this.state.firstCategory !== '' && this.state.firstCategory !== null)
			categoryArray.push(this.state.firstCategory);
		if(this.state.secondCategory !== '' && this.state.secondCategory !== null
			&& this.state.firstCategory !== this.state.secondCategory)
			categoryArray.push(this.state.secondCategory)

		fetch('http://localhost:3000/api/user', {
 			method: 'post',
  		headers: {
    		'Accept': 'application/json, text/plain, */*',
    		'Content-Type': 'application/json'
  		},
  		credentials: 'include',
  		body: JSON.stringify({
  			username: this.state.username,
		  	email: this.state.email,
		  	type: this.state.type,
		  	password: this.state.password,
		  	passwordMatch: this.state.passwordMatch,
		  	imgUrl: this.state.imgUrl,
		  	description: this.state.description,
		  	mobilePhone: this.state.mobilePhone,
		  	address: this.state.address,
		  	category: categoryArray,
  		})
		}).then(res => res.json())
  	.then(res => {
  		if(res.confirmation === 'success') {
	  		this.props.logInUser(res.result);
	  		this.props.history.push("/profil");
  		} else {
  			console.log(res);
  			this.setState({ errorMessages: res.result });
  		} 
  	});
	}

	uploadFile(files) {
		const file = files[0];
		const { CLOUDINARY_URL, CLOUDINARY_UPLOAD_PRESET } = Const;

		var formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

		axios({
			url: CLOUDINARY_URL,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: formData
		}).then(res => {
			console.log(res.data.secure_url);
			this.setState({ imgUrl: res.data.secure_url });
		}).catch(err => {
			console.log(err)
		});
	}

	renderCategorySelect() {
		let optionsFirst = [];
		Const.categories.map((category, index) => {
			if(category.label != this.state.firstCategory && category.label != this.state.secondCategory)
				optionsFirst.push({ value: category.label, label: category.label }); 
		});
		let optionsSecond = [];
		Const.categories.map((category, index) => {
			if(category.label != this.state.firstCategory && category.label != this.state.secondCategory)
				optionsSecond.push({ value: category.label, label: category.label }); 
		});
		return (
			<div className="form-group">
				<label>Odaberi dvije kategorije u kojima će se pojavljivati tvoj oglas.</label><br />
				<label>Prva kategorija: </label>
				<Select
				  name="firstCategorySelect" 
				  value={{ value: this.state.firstCategory, label: this.state.firstCategory }}
					className="form-control" 
					onChange={this.onChangeFirstCategory}
					options={optionsFirst}
				/>
				<label>Druga kategorija: </label>
				<Select
				  name="secondCategorySelect" 
				  value={{ value: this.state.secondCategory, label: this.state.secondCategory }}
					className="form-control" 
					onChange={this.onChangeSecondCategory}
					options={optionsSecond}
				/>
			</div>
		);
	}

	renderWarnings() {
		if(this.state.errorMessages) {
			return (
				<div>
					{this.state.errorMessages.map((message, index) => {
						return (
							<div className="alert alert-warning mt-3 mb-0" role="alert" key={index} >
	  						<strong>Upozorenje!</strong> {message}
							</div>
						);
					})}
				</div>
			);
		} else {
			return null;
		}
	}

	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-2" />
					{this.renderWarnings()}
					<div className="col-8">
						<form className="mt-3" action="/api/user" method="POST" onSubmit={this.onSubmit}>
						  <div className="form-group">
						  	<label>Korisničko ime</label>
						  	<input type="text" name="username" className="form-control" value={this.state.username} placeholder="Username" onChange={this.onChangeUsername} />
						  </div>
						  <div className="form-group">
						  	<label>Lozinka</label>
						  	<input type="password" name="password" className="form-control" value={this.state.password} placeholder="Enter password" onChange={this.onChangePassword} />
						  </div>
						  <div className="form-group">
						  	<label>Ponovno unesite lozinku</label>
						  	<input type="password" name="passwordMatch" className="form-control" value={this.state.passwordMatch} placeholder="Re-enter password" onChange={this.onChangePasswordMatch} />
						  </div>
						  <div className="form-group">
						  	<label>Email</label>
						  	<input type="email" name="email" className="form-control" value={this.state.email} placeholder="Email" onChange={this.onChangeEmail} />
						  </div>
						  <div className="form-group">
						  	<label>Broj mobitela/telefona</label>
						  	<input type="text" name="type" className="form-control" value={this.state.mobilePhone} placeholder="Mobile Phone" onChange={this.onChangeMobilePhone} />
						  </div>
						  <div className="form-group">
						  	<label>Adresa/Lokacija</label>
						  	<input type="text" name="type" className="form-control" value={this.state.address} placeholder="Address" onChange={this.onChangeAddress} />
						  </div>
						  <div className="form-group">
						  	<label>Tip</label>
						  	<input type="text" name="type" className="form-control" value={this.state.type} placeholder="Type" onChange={this.onChangeType} />
						  </div>
						  <div className="form-group">
						  	<label>Sadržaj oglasa</label>
						  	<input type="text" name="type" className="form-control" value={this.state.description} placeholder="Description" onChange={this.onChangeDescription} />
						  </div>
						  {this.renderCategorySelect()}
						  <input type="submit" className="btn btn-primary" value="Submit" />
						</form>
						<Dropzone onDrop={this.uploadFile} />
						<img src={this.state.imgUrl} style={{ height: 200, width: 200 }}/>
					</div>
					<div className="col-2" />
				</div>
			</div>
		);	
	}
}

const stateToProps = (state) => {
	return {
		user: state.profiles.user,
	};
};

const dispatchToProps = (dispatch) => {
	return {
		logInUser: (user) => dispatch(actions.logInUser(user)),
	}
};

export default connect(stateToProps, dispatchToProps)(RegisterComponent);