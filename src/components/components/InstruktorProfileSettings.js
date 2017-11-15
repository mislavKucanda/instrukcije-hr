import React, { Component } from 'react';
import { connect } from 'react-redux';

import actions from '../../actions';

class InstruktorProfileSettings extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hoveredElement: '',
			selectedElement: '',
			user: {},
			errorMessages: [],
		}

		this.renderChangeButton = this.renderChangeButton.bind(this);
		this.renderInputElement = this.renderInputElement.bind(this);
		this.populateStateWithUser = this.populateStateWithUser.bind(this);
		this.changeUserElement = this.changeUserElement.bind(this);
		this.renderWarnings = this.renderWarnings.bind(this);
		this.renderInputElementChange = this.renderInputElementChange.bind(this);
		this.renderAreaInputElement = this.renderAreaInputElement.bind(this);
	}

	componentDidMount() {
		this.populateStateWithUser();
	}

	populateStateWithUser() {
		const { user } = this.props;
		this.setState({ user });
	}

	changeUserElement() {
		const { user } = this.state;
		//make an api request to update the user
		fetch('http://localhost:3000/api/user', {
 			method: 'put',
  		headers: {
    		'Accept': 'application/json, text/plain, */*',
    		'Content-Type': 'application/json'
  		},
  		credentials: 'include',
  		body: JSON.stringify(user)
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

	renderInputElementChange(label, element, type) {
		return (
			<div className="row">
				<div className="col-lg-2 col-md-2 col-sm-3">
					<p>{label}</p>
				</div>
				<div className="col-lg-8 col-md-8 col-sm-7">
					{type === 'area'
						? this.renderAreaInputElement(element)	
						: this.renderInputElement(element)
					}
				</div>
				<div className="col-lg-2 col-md-2 col-sm-2">
					{this.renderChangeButton(element)}
				</div>
			</div>
		);
	}

	render() {
		const { user } = this.props;
		return (
			<div>
				{this.renderWarnings()}
				{this.renderInputElementChange('Korisničko ime:', 'username', 'line')}
				<hr className="mt-0" />
				{this.renderInputElementChange('Adresa / lokacija:', 'address', 'line')}
				<hr className="mt-0" />
				{this.renderInputElementChange('Broj mobitela / telefona:', 'mobilePhone', 'line')}
				<hr className="mt-0" />
				{this.renderInputElementChange('E-mail:', 'email', 'line')}
				<hr className="mt-0" />
				{this.renderInputElementChange('Sadržaj oglasa:', 'description', 'area')}
				<hr className="mt-0 mb-5" />
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