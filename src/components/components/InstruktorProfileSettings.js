import React, { Component } from 'react';
import { connect } from 'react-redux';

class InstruktorProfileSettings extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hoveredElement: '',
			selectedElement: '',
			username: '',
			email: '',
		}

		this.renderChangeButton = this.renderChangeButton.bind(this);
		this.renderInputElement = this.renderInputElement.bind(this);
		this.onChangeInputElement = this.onChangeInputElement.bind(this);
	}

	componentDidMount() {
		const { user } = this.props;
		this.setState({ username: user.username });
		this.setState({ email: user.email });
	}

	renderChangeButton(element) {
		const { selectedElement } = this.state;
		return (
			<p 
				onMouseOver={() => this.setState({ hoveredElement: element })} 
      	onMouseOut={() => this.setState({ hoveredElement: '' })}
   		  onClick={() => this.setState({ selectedElement: (selectedElement !== element ? element : '') })}
				className="text-right" 
				style={{ color: this.state.hoveredElement === element ? '#36B39C' : '#212529' }}
			>
				{selectedElement !== element ? 'Promijeni' : 'Spremi'}	
			</p>
		);
	}

	onChangeInputElement(event, element) {
		this.setState([element]: event.target.value);
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
						value={this.state[element]} 
						onChange={event => this.onChangeInputElement(event, element)}
					/>
				)
		);
	}

	render() {
		const { user } = this.props;
		return (
			<div>
				<div className="row">
					<div className="col-lg-2 col-md-2 col-sm-3">
						<p>Korisničko ime:</p>
					</div>
					<div className="col-lg-8 col-md-8 col-sm-7">
						{this.renderInputElement('username')}
					</div>
					<div className="col-lg-2 col-md-2 col-sm-2">
						{this.renderChangeButton('username')}
					</div>
				</div>
				<hr className="mt-0" />
				<div className="row">
					<div className="col-lg-2 col-md-2 col-sm-3">
						<p>E-mail:</p>
					</div>
					<div className="col-lg-8 col-md-8 col-sm-7">
						{this.renderInputElement('email')}
					</div>
					<div className="col-lg-2 col-md-2 col-sm-2">
						{this.renderChangeButton('email')}
					</div>
				</div>
				<hr className="mt-0" />
			</div>
		);
	}
}

const stateToProps = (state) => {
	return {
		user: state.profiles.user,
	};
};

export default connect(stateToProps)(InstruktorProfileSettings);