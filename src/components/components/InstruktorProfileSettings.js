import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import axios from 'axios';

import actions from '../../actions';
import Const from '../../../const';
import ProfileCard from './profileCard';

class InstruktorProfileSettings extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hoveredElement: '',
			selectedElement: '',
			user: {},
			errorMessages: [],
			newPassword: '',
			newPasswordRepeat: '', 
			imgUrl: '',
			cancelPictureButtonColor: '#36B39C',
			registerButtonColor: '#36B39C',
		}

		this.renderChangeButton = this.renderChangeButton.bind(this);
		this.renderInputElement = this.renderInputElement.bind(this);
		this.populateStateWithUser = this.populateStateWithUser.bind(this);
		this.changeUserElement = this.changeUserElement.bind(this);
		this.onChangeCategory = this.onChangeCategory.bind(this);
		this.renderWarnings = this.renderWarnings.bind(this);
		this.renderInputElementChange = this.renderInputElementChange.bind(this);
		this.renderAreaInputElement = this.renderAreaInputElement.bind(this);
		this.renderMultiSelectInputElement = this.renderMultiSelectInputElement.bind(this);
		this.renderSelectInputElement = this.renderSelectInputElement.bind(this);
		this.renderPasswordInputElement = this.renderPasswordInputElement.bind(this);
		this.renderChangePictureElement = this.renderChangePictureElement.bind(this);
		this.renderSavePictureButton = this.renderSavePictureButton.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
	}

	componentDidMount() {
		this.populateStateWithUser();
	}

	populateStateWithUser() {
		const { user } = this.props;
		this.setState({ user });
	}

	onChangeCategory(event, element) {
		var options = event.target.options;
  	var value = [];
  	for (var i = 0, l = options.length; i < l; i++) {
    	if (options[i].selected) {
      	value.push(options[i].value);
    	}
  	}
  	this.setState({
			user: Object.assign({}, this.state.user, {
				[element]: value
			})
		});
	}

	changeUserElement() {
		const { user, newPassword, newPasswordRepeat, imgUrl } = this.state;
		let passwordIsChanged = false;
		//If new password is set make client side validation
		if(newPassword !== '') {
			if(newPassword === newPasswordRepeat) {
				passwordIsChanged = true;
			} else {
				this.setState({ errorMessages: ['Unesene lozinke se ne podudaraju.'] });
				return;
			}
		}

		//If user is not changed, do not make an update request
		if(Object.is(user, this.props.user) && !passwordIsChanged && imgUrl === '') {
			return;
		}

		let newUser;
		if(passwordIsChanged) {
			newUser = Object.assign({}, user, {
				password: newPassword,
			});
		} else if (imgUrl !== '') {
			newUser = Object.assign({}, user, {
				imgUrl: imgUrl,
			});
		} else {
			newUser = user;
		}

		console.log(newUser);

		//make an api request to update the user
		fetch('http://localhost:3000/api/user', {
 			method: 'put',
  		headers: {
    		'Accept': 'application/json, text/plain, */*',
    		'Content-Type': 'application/json'
  		},
  		credentials: 'include',
  		body: JSON.stringify(newUser)
		}).then(res => res.json())
  	.then(res => {
  		if(res.confirmation === 'success') {
  			//If api request is successfull, update application state
	  		this.props.logInUser(res.result);
	  		this.populateStateWithUser();
  		} else {
  			//If api request is not successfull, display error message
  			this.setState({ errorMessages: res.result });
  		} 
  	});
	}

	renderChangeButton(element) {
		const { selectedElement } = this.state;
		return (
			<p 
				onMouseOver={() => this.setState({ hoveredElement: element })} 
      	onMouseOut={() => this.setState({ hoveredElement: '' })}
   		  onClick={() => {
   		  	//Reset user if change on user element is not saved
   		  	if(selectedElement !== '') {
   		  		this.populateStateWithUser();
   		  		this.setState({ newPassword: '' });
   		  		this.setState({ newPasswordRepeat: '' });
   		  		this.setState({ errorMessages: [] });
   		  	}
   		  	//Save change on user element to database and update application state
   		  	if(selectedElement === element) {
   		  		this.changeUserElement();
   		  	}
   		  	this.setState({ selectedElement: (selectedElement !== element ? element : '') })
   		  }}
				className="text-right" 
				style={{ 
					color: this.state.hoveredElement === element ? '#5C9B8E' : '#36B39C', 
					textDecoration: this.state.hoveredElement === element ? 'underline' : null,
					cursor: 'pointer' 
				}}
			>
				{selectedElement !== element ? 'Promijeni' : 'Spremi'}	
			</p>
		);
	}

	renderInputElement(element) {
		const { user } = this.props;
		const { selectedElement } = this.state;
		return(
			selectedElement !== element
				? (
					<p>{user[element]}</p>
				) 
				: (
					<input
						type="text"
						className="form-control mb-3"
						value={this.state.user[element]} 
						onChange={(event) => this.setState({
							user: Object.assign({}, this.state.user, {
								[element]: event.target.value
							}),
						})}
					/>
				)
		);
	}

	renderPasswordInputElement() {
		const { selectedElement } = this.state;
		return (
			selectedElement !== 'password'
				? <p>**********</p> 
				: (
					<div>
						<input 
							type="password"
							className="form-control mb-3"
							placeholder="Nova lozinka"
							value={this.state.newPassword}
							onChange={event => this.setState({ newPassword: event.target.value })}
						/>
						<input 
							type="password"
							className="form-control mb-3"
							placeholder="Ponovite unos nove lozinke"
							value={this.state.newPasswordRepeat}
							onChange={event => this.setState({ newPasswordRepeat: event.target.value })}
						/>
					</div>
				)
		);
	}

	renderAreaInputElement(element) {
		const { user } = this.props;
		const { selectedElement } = this.state;
		return(
			selectedElement !== element
				? (
					<p>{user[element]}</p>
				) 
				: (
					<textarea
						type="text"
						rows={3}
						className="form-control mb-3"
						value={this.state.user[element]} 
						onChange={(event) => this.setState({
							user: Object.assign({}, this.state.user, {
								[element]: event.target.value
							}),
						})}
					/>
				)
		);
	}

	renderMultiSelectInputElement(element) {
		const { user } = this.props;
		const { selectedElement } = this.state;
		return(
			selectedElement !== element
				? (
					<p>{user[element].map((category, index) => {
						return category + (index !== (user[element].length - 1) ? ', ' : '')
					})}</p>
				) 
				: (
					<select
						multiple
						className="form-control mb-3" 
						value={this.state.user[element]} 
						onChange={(event) => this.onChangeCategory(event, element)}
					>
						<option value="MATEMATIKA">MATEMATIKA</option>
						<option value="KEMIJA">KEMIJA</option>
						<option value="HRVATSKI">HRVATSKI</option>
						<option value="MATURA">MATURA</option>
						<option value="STROJARSTVO">STROJARSTVO</option>
						<option value="STRANI JEZICI">STRANI JEZICI</option>
						<option value="GLAZBENI">GLAZBENI</option>
						<option value="LEKTORIRANJE">LEKTORIRANJE</option>
						<option value="ELEKTROTEHNIKA">ELEKTROTEHNIKA</option>
						<option value="BIOLOGIJA">BIOLOGIJA</option>
						<option value="INFORMATIKA">INFORMATIKA</option>
						<option value="FIZIKA">FIZIKA</option>
					</select>
				)
		);
	}

	renderSelectInputElement(element) {
		const { user } = this.props;
		const { selectedElement } = this.state;
		if(element === 'educationLevel') {
			return(
				selectedElement !== element
					? (
						<p>{user[element]}</p>
					) 
					: (
						<select 
							className="form-control mb-3" 
							value={this.state.user[element]} 
							onChange={(event) => this.setState({
								user: Object.assign({}, this.state.user, {
									[element]: event.target.value,
									institutionName: event.target.value === 'OSNOVNA ŠKOLA' ? '' : this.state.user.institutionName,
								}),
							})}
						>
							<option value="OSNOVNA ŠKOLA">OSNOVNA ŠKOLA</option>
							<option value="SREDNJA ŠKOLA">SREDNJA ŠKOLA</option>
							<option value="FAKULTET">FAKULTET</option>
						</select>
					)
			);
		} else if (element === 'educationGrade') {
			return(
				selectedElement !== element
					? (
						<p>{user[element]}</p>
					) 
					: (
						<select 
							className="form-control mb-3" 
							value={this.state.user[element]} 
							onChange={(event) => this.setState({
								user: Object.assign({}, this.state.user, {
									[element]: event.target.value
								}),
							})}
						>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
						</select>
					)
			);
		}
	}

	renderWarnings() {
		if(this.state.errorMessages) {
			return (
				<div className="row">
					<div className="col-2" />
						<div className="col-8">
							{this.state.errorMessages.map((message, index) => {
								return (
									<div className="alert alert-warning mb-3 mb-0" role="alert" key={index} >
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

	renderChangePictureElement() {
		return(
			<div className="row">
				<div className="col-lg-4 col-sm-3" />
				<div className="col-lg-4 col-sm-6" align="center">
					<Dropzone onDrop={this.uploadFile}>
						<div className="pt-4">
							<p className="pt-5">Kliknite za odabir nove profilne fotografije</p>
						</div>
					</Dropzone>
				</div>
				<div className="col-lg-4 col-sm-3" />
		</div>
		);
	}

	renderInputElementChange(label, element, type) {
		let InputElement;
		if(type === 'area') {
			InputElement = this.renderAreaInputElement(element);
		} else if (type === 'line') {
			if( element === 'password') {
				InputElement = this.renderPasswordInputElement();
			} else {
				InputElement = this.renderInputElement(element);
			}
		} else if (type === 'multiselect') {
			InputElement = this.renderMultiSelectInputElement(element);
		} else if (type === 'select') {
			InputElement = this.renderSelectInputElement(element);
		}
		return (
			<div>
				<div className="row">
					<div className="col-lg-2 col-md-2 col-sm-3">
						<p>{label}</p>
					</div>
					<div className="col-lg-8 col-md-8 col-sm-7">
						{InputElement}
					</div>
					<div className="col-lg-2 col-md-2 col-sm-2">
						{this.renderChangeButton(element)}
					</div>
				</div>
				<hr className="mt-0" />
			</div>
		);
	}

	renderProfileDisplay() {
		const { imgUrl } = this.state;
		return(
			<div className="row">
					<div className="col-lg-1 col-md-0 col-sm-0" />
					<div className="col-lg-3 col-md-4 col-sm-4">
						<input
							type="submit" 
							className="btn btn-primary" 
							style={{ backgroundColor: this.state.cancelPictureButtonColor, borderColor: '#5c9b8e' }}
							value="Odustani"
							onClick={event => this.setState({ imgUrl: '' })}
							onMouseOver={() => this.setState({ cancelPictureButtonColor: '#5c9b8e' })}
              onMouseOut={() => this.setState({ cancelPictureButtonColor: '#36B39C' })}
						/>
					</div>
					<div className="col-lg-4 col-md-5 col-sm-7">
						<ProfileCard profile={{ imgUrl, address:'', mobilePhone:'', email:'', username:'', description:'' }} />
					</div>
					<div className="col-lg-4 col-md-3 col-sm-1" />
			</div>
		);
	}

	renderSavePictureButton() {
		return(
			<div className="row mt-3 mb-5">
				<div className="col-lg-3 col-sm-2" />
					<div className="col-lg-6 col-sm-8" align="center">
						<input 
							type="submit" 
							className="btn btn-primary" 
							style={{ backgroundColor: this.state.registerButtonColor, borderColor: '#5c9b8e' }}
							value="Zadovoljan sam novom profilnom slikom, SPREMI!" 
							onClick={() => {
								this.changeUserElement();
								this.setState({ imgUrl: '' });
							}} 
							onMouseOver={() => this.setState({ registerButtonColor: '#5c9b8e' })}
              onMouseOut={() => this.setState({ registerButtonColor: '#36B39C' })}
						/>
					</div>
				<div className="col-lg-3 col-sm-2" />
			</div>
		);
	}

	render() {
		const { user } = this.props;
		return (
			<div className="mb-5">
				{this.renderWarnings()}
				{this.renderInputElementChange('Korisničko ime:', 'username', 'line')}
				{this.renderInputElementChange('Lozinka:', 'password', 'line')}
				{
					user.type === 'instruktor' 
						? this.renderInputElementChange('Adresa / lokacija:', 'address', 'line')
						: null
				}
				{this.renderInputElementChange('Broj mobitela / telefona:', 'mobilePhone', 'line')}
				{this.renderInputElementChange('E-mail:', 'email', 'line')}
				{
					user.type === 'instruktor'
						? this.renderInputElementChange('Sadržaj oglasa:', 'description', 'area')
						: null
				}
				{
					user.type === 'instruktor' 
						? this.renderInputElementChange('Kategorije oglasa:', 'category', 'multiselect')
						: null
				}
				{
					user.type === 'student'
						? this.renderInputElementChange('Stupanj obrazovanja:', 'educationLevel', 'select')
						: null
				}
				{
					user.type === 'student'
						? this.renderInputElementChange('Razred / godina:', 'educationGrade', 'select')
						: null
				}
				{
					user.type === 'student' && user.educationLevel !== 'OSNOVNA ŠKOLA'
						? this.renderInputElementChange('Naziv škole / fakulteta:', 'institutionName', 'line')
						: null
				}
				<div className="container mt-5">
					<div>
						<p className="text-center mb-0 mt-3">
							OVDJE PROMIJENITE PROFILNU FOTOGRAFIJU
						</p>
						<div className="container">
							<div className="container">
								<hr className="mt-0" />
							</div>
						</div>
					</div>
					{this.state.imgUrl
						? (
							<div>
								{this.renderProfileDisplay()}
								{this.renderSavePictureButton()}
							</div>
						) 
						: this.renderChangePictureElement()
					}
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

export default connect(stateToProps, dispatchToProps)(InstruktorProfileSettings);