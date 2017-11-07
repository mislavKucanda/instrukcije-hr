import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Select from 'react-select';
import axios from 'axios';
import { connect } from 'react-redux';

import actions from '../actions';
import Const from '../../const';
import ProfileCard from './components/profileCard';

class RegisterComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			registerButtonColor: '#36B39C',
			cancelPictureButtonColor: '#36B39C',
			errorMessages: [],
			username: '',
			email: '',
			type: 'instruktor',
			password: '',
			passwordMatch: '',
			imgUrl: '',
			description: '',
			address: '',
			mobilePhone: '',
			firstCategory: '',
			secondCategory: '',
			hooverCategory: '',																						//those are registration categories
			selectedCategory: 'INSTRUKTOR',																//those are registration categories
			categoryInfo: 'Kao instruktor možete kreirati oglas i odabrati do dvije kategorije unutar kojih će se prikazivati. Također možete postavljati u kalendar slobodne termine za instrukcije kako bi ih studenti/učenici mogli rezervirati.',			//those are registration categories
		}

		this.onChangeUsername = this.onChangeUsername.bind(this);
		this.onChangeEmail = this.onChangeEmail.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.onChangePasswordMatch = this.onChangePasswordMatch.bind(this);
		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.onChangeAddress = this.onChangeAddress.bind(this);
		this.onChangeMobilePhone = this.onChangeMobilePhone.bind(this);
		this.renderCategorySelect = this.renderCategorySelect.bind(this);
		this.onChangeFirstCategory = this.onChangeFirstCategory.bind(this);
		this.onChangeSecondCategory = this.onChangeSecondCategory.bind(this);
		this.onMouseOverCategory = this.onMouseOverCategory.bind(this);
		this.onMouseOutCategory = this.onMouseOutCategory.bind(this);
		this.onHooverButton = this.onHooverButton.bind(this);
		this.onStopHooverButton = this.onStopHooverButton.bind(this);
		this.onCancelPictureSelect = this.onCancelPictureSelect.bind(this);
		this.renderWarnings = this.renderWarnings.bind(this);
		this.renderRegistrationCategories = this.renderRegistrationCategories.bind(this);
		this.renderDescriptionInfo = this.renderDescriptionInfo.bind(this);
		this.renderCredentialsInput = this.renderCredentialsInput.bind(this);
		this.renderContactInfo = this.renderContactInfo.bind(this);
		this.renderDescriptionInput = this.renderDescriptionInput.bind(this);
		this.renderContactInput = this.renderContactInput.bind(this);
		this.renderProfileDisplay = this.renderProfileDisplay.bind(this);
		this.onSelectCategory = this.onSelectCategory.bind(this);
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
  			this.setState({ errorMessages: res.result });
  			window.scrollTo(0, 0);
  		} 
  	});
	}

	onMouseOverCategory(element, label) {
		this.setState({ hooverCategory: label });
	}

	onMouseOutCategory() {
		this.setState({ hooverCategory: '' });
	}

	onSelectCategory(element, label, categoryInfo, type) {
		if(label === this.state.selectedCategory) {
			this.setState({ selectedCategory: '' });
			this.setState({ categoryInfo: '' });
			this.setState({ type: '' });
		} else {
			this.setState({ selectedCategory: label });
			this.setState({ categoryInfo });
			this.setState({ type: type });
		}
	}

	onHooverButton(component) {
		if(component === 'registrationButton')
			this.setState({ registerButtonColor: '#5c9b8e' });
		else if (component === 'cancelPictureButton') 
			this.setState({ cancelPictureButtonColor: '#5c9b8e' });
	}

	onStopHooverButton(component) {
		if(component === 'registrationButton')
			this.setState({ registerButtonColor: '#36B39C' });
		else if (component === 'cancelPictureButton') 
			this.setState({ cancelPictureButtonColor: '#36B39C' });
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

	onCancelPictureSelect(event) {
		event.preventDefault();
		this.setState({ imgUrl: '' });
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
			<div>
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
				  className="form-control" 
				  value={{ value: this.state.secondCategory, label: this.state.secondCategory }}
					onChange={this.onChangeSecondCategory}
					options={optionsSecond}
				/>
			</div>
		);
	}

	renderWarnings() {
		if(this.state.errorMessages) {
			return (
				<div className="row">
					<div className="col-2" />
						<div className="col-8">
							{this.state.errorMessages.map((message, index) => {
								return (
									<div className="alert alert-warning mt-3 mb-0" role="alert" key={index} >
			  						<strong>Upozorenje!</strong> {message}
									</div>
								);
							})}
						</div>
					<div className="col-2" />
				</div>
			);
		} else {
			return null;
		}
	}

	renderRegistrationCategories() {
		return(
			<div className="row mt-3">
				<div className="col-lg-2" />
				<div className="col-lg-2 col-sm-3 col-xs-2">
					{this.state.selectedCategory === 'INSTRUKTOR' 
						? <p className="mb-0" style={{ fontSize: '0.7rem', textAlign: 'center' }}>{Const.registrationCategories[0].categoryInfo}</p> 
						: null}
				</div>
	      {Const.registrationCategories.map((category, index) => {
	      	let opacityLevel = 1;
	      	if(category.label === this.state.hooverCategory) //if mouse hoovers the category, set opacity level to 0.5
	      		opacityLevel = 0.5;

	      	let backgroundColor = '#f1f2f2';
	      	if(category.label === this.state.selectedCategory) //if mose clicks the category, set background to light green
	      		backgroundColor = '#b5dbd2';

	      	return(
 						<div 
 							className="col-lg-2 col-sm-3 col-xs-4" 
 							onMouseOver={(elem) => this.onMouseOverCategory(elem, category.label)} 
 							onMouseOut={this.onMouseOutCategory}
 							onClick={(elem) => this.onSelectCategory(elem, category.label, category.categoryInfo, category.type)}
 							key={index}
 							style={{ backgroundColor }}
 						>
	        		<img src={category.url} style={{ opacity: opacityLevel }} className="img-fluid p-2" />
	        		<p className="text-center">{category.label}</p>
	        	</div>
	      	);
	      })}
	      <div className="col-lg-2 col-sm-3 col-xs-2">
					{this.state.selectedCategory === 'STUDENT / UČENIK' 
						? <p className="mb-0" style={{ fontSize: '0.7rem', textAlign: 'center' }}>{Const.registrationCategories[1].categoryInfo}</p> 
						: null}
				</div>
	      <div className="col-lg-2" />
	    </div>
		);
	}

	renderRegistrationCategoryInfo() {
		return (
			<div>
				<p className="text-center mb-0 mt-3">
					NAJPRIJE ODABERITE DA LI STE INSTRUKTOR ILI STUDENT/UČENIK
				</p>
				<hr className="mt-0" />
			</div>
		);
	}

	renderDescriptionInfo(text) {
		return (
			<div>
				<p className="text-center mb-0 mt-3">
					{text}
				</p>
				<hr className="mt-0" />
			</div>
		);
	}

	renderContactInfo(infoText, topMarginStyle) {
		return(
			<div className={'row ' + topMarginStyle}>
				<div className="col-lg-2" />
					<div className="col-lg-8">				
						<p className="text-center mb-0 mt-3">
							{infoText}
						</p>
						<hr className="mt-0" />
					</div>	
				<div className="col-lg-2" />
			</div>
		);
	}

	renderCredentialsInput() {
		return(
			<div className="row">
				<div className="col-lg-4 col-sm-2" />
					<div className="col-lg-4 col-sm-8">
						<div className="form-group">
							<input 
								type="text"
								className="form-control" 
								value={this.state.username} 
								placeholder="Korisničko ime" 
								onChange={this.onChangeUsername}
							/>
						</div>
						<div className="form-group">
							<input 
								type="password"
								className="form-control" 
								value={this.state.password} 
								placeholder="Lozinka" 
								onChange={this.onChangePassword} 
							/>
						</div>
						<div className="form-group">
							<input 
								type="password"
								className="form-control" 
								value={this.state.passwordMatch} 
								placeholder="Ponovljena lozinka" 
								onChange={this.onChangePasswordMatch} 
							/>
						</div>
					</div>
				<div className="col-lg-4 col-sm-2" />
			</div>
		);
	}

	renderDescriptionInput(){
		return(
			<div className="form-group">
				<label>Sadržaj oglasa:</label>
				<textarea 
					type="text" 
					rows={4}
					className="form-control" 
					value={this.state.description} 
					onChange={this.onChangeDescription}
				/>
			</div>
		);
	}	

	renderContactInput() {
		return(
			<div className="row">
				<div className="col-lg-4 col-sm-2" />
					<div className="col-lg-4 col-sm-8">
						<div className="form-group">
							<input 
								type="email" 
								className="form-control" 
								value={this.state.email} 
								placeholder="Email" 
								onChange={this.onChangeEmail} 
							/>
						</div>
					<div className="form-group">
						<input 
							type="text" 
							className="form-control" 
							value={this.state.mobilePhone} 
							placeholder="Broj mobitela/telefona" 
							onChange={this.onChangeMobilePhone} 
						/>
					</div>
					<div className="form-group">
						<input 
						  type="text" 
						  className="form-control" 
						  value={this.state.address} 
						  placeholder="Adresa/Lokacija" 
						  onChange={this.onChangeAddress} 
						/>
					</div>
				</div>
				<div className="col-lg-4 col-sm-2" />
			</div>
		);
	}

	renderProfileDisplay() {
		const { imgUrl, address, mobilePhone, email, username, description } = this.state;
		return(
			<div className="row">
					<div className="col-lg-1 col-md-0 col-sm-0" />
					<div className="col-lg-3 col-md-4 col-sm-4">
						<input
							type="submit" 
							className="btn btn-primary" 
							style={{ backgroundColor: this.state.cancelPictureButtonColor, borderColor: '#5c9b8e' }}
							value="Promijeni fotografiju"
							onClick={this.onCancelPictureSelect}
							onMouseOver={() => this.onHooverButton('cancelPictureButton')}
              onMouseOut={() => this.onStopHooverButton('cancelPictureButton')}
						/>
					</div>
					<div className="col-lg-4 col-md-5 col-sm-7">
						<ProfileCard profile={{ imgUrl, address, mobilePhone, email, username, description }} />
					</div>
					<div className="col-lg-4 col-md-3 col-sm-1" />
			</div>
		);
	}

	renderProfileInput() {
		return(
			<div className="row">
					<div className="col-lg-4 col-sm-3" />
					<div className="col-lg-4 col-sm-6" align="center">
						<Dropzone onDrop={this.uploadFile}>
							<p>Kliknite za odabir profilne fotografije</p>
						</Dropzone>
					</div>
					<div className="col-lg-4 col-sm-3" />
			</div>
		);
	}

	render() {
		return (
			<div className="container">
				{this.renderRegistrationCategoryInfo()}
				{this.renderRegistrationCategories()}
				{this.renderWarnings()}					
				{this.renderContactInfo('UNESITE KORISNIČKO IME I LOZINKU', 'mt-4')}
				{this.renderCredentialsInput()}
				{this.renderContactInfo('UNESITE PODATKE ZA KONTAKT', 'mt-2')}
				{this.renderContactInput()}
				{this.renderDescriptionInfo('UNESITE SADRŽAJ VAŠEG OGLASA I ODABERITE DO DVIJE KATEGORIJE U KOJIMA ĆE SE VAŠ OGLAS PRIKAZIVATI')}
				<div className="row">
					<div className="col-lg-3 col-sm-2" />
					<div className="col-lg-6 col-sm-8">	
						  {this.renderDescriptionInput()}
						  {this.renderCategorySelect()}
					</div>
					<div className="col-lg-3 col-sm-2" />
				</div>
				{this.renderDescriptionInfo('ODABERITE PROFILNU FOTOGRAFIJU I DOVRŠITE REGISTRACIJU AKO STE ZADOVOLJNI IZGLEDOM VAŠEG OGLASA')}
				{this.state.imgUrl
					? this.renderProfileDisplay() 
					: this.renderProfileInput()
				}	
				<div className="row mt-3 mb-5">
					<div className="col-lg-3 col-sm-2" />
					<div className="col-lg-6 col-sm-8" align="center">
						<input 
							type="submit" 
							className="btn btn-primary" 
							style={{ backgroundColor: this.state.registerButtonColor, borderColor: '#5c9b8e' }}
							value="Zadovoljan sam svojim oglasom, REGISTRIRAJ ME!" 
							onClick={this.onSubmit} 
							onMouseOver={() => this.onHooverButton('registrationButton')}
              onMouseOut={() => this.onStopHooverButton('registrationButton')}
						/>
					</div>
					<div className="col-lg-3 col-sm-2" />
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