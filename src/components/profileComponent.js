import React, { Component } from 'react';
import { connect } from 'react-redux'

class ProfileComponent extends Component {

	constructor(props) {
		super(props);

		this.state = {
			profile: {},
		}

		this.renderDescriptionInfo = this.renderDescriptionInfo.bind(this);
		this.renderLocationInfo = this.renderLocationInfo.bind(this);
		this.renderMobilePhoneInfo = this.renderMobilePhoneInfo.bind(this);
		this.renderEmailInfo = this.renderEmailInfo.bind(this);
	}

	componentDidMount() {
		const { user } = this.props;
		//If profile id is sent via URL properties, set profile in state of correct id
		if(this.props.profileId) {
			let profile = this.props.profiles.find((elem) => 
				{ return elem._id === this.props.profileId });
			this.setState({ profile });
		//If user is registered/logged in, set profile in state from props, otherwise redirect to log in
		} else {
			if(Object.getOwnPropertyNames(user).length === 0)
				this.props.history.push("/prijava");
			else
				this.setState({ profile: user });
		}
	}
	
	renderDescriptionInfo() {
		const { description } = this.state.profile;
		if(description !== null && description !== '') {
			return (
				<tr>
					<th style={{ fontWeight: 400, textAlign: 'right', verticalAlign: 'top' }}>OPIS:</th>
					<th className="pl-3" style={{ fontWeight: 400 }}>{description}</th>
				</tr>
				);
		}
		return null;
	}

	renderLocationInfo() {
		const { address } = this.state.profile;
		if(address !== null && address !== '') {
			return (
				<tr>
					<th style={{ fontWeight: 400, textAlign: 'right', verticalAlign: 'top' }}>LOKACIJA:</th>
					<th className="pl-3" style={{ fontWeight: 400 }}>{address}</th>
				</tr>
				);
		}
		return null;
	}

	renderMobilePhoneInfo() {
		const { mobilePhone } = this.state.profile;
		if(mobilePhone !== null && mobilePhone !== '') {
			return (
				<tr>
					<th style={{ fontWeight: 400, textAlign: 'right', verticalAlign: 'top' }}>MOBITEL:</th>
					<th className="pl-3" style={{ fontWeight: 400 }}>{mobilePhone}</th>
				</tr>
				);
		}
		return null;
	}

	renderEmailInfo() {
		const { email } = this.state.profile;
		if(email !== null && email !== '') {
			return (
				<tr>
					<th style={{ fontWeight: 400, textAlign: 'right', verticalAlign: 'top' }}>EMAIL:</th>
					<th className="pl-3" style={{ fontWeight: 400 }}>{email}</th>
				</tr>
				);
		}
		return null;
	}

	render() {
		const { username, email, password, type, imgUrl, activated } = this.state.profile;
		return(
			<div className="container">
				<div className="row">
					<div className="col-lg-3 col-md-3 my-3">
						<div>
							<img src={imgUrl} alt="Profile picture" style={{ width: '100%', borderRadius: '3%' }} />
							<div className="text-center mt-3">{username}</div>
						</div>
					</div>
					<div className="col-lg-9 col-md-9" style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
						<div>
							<table>
								<tbody>
									{this.renderDescriptionInfo()}
									{this.renderLocationInfo()}
									{this.renderMobilePhoneInfo()}
									{this.renderEmailInfo()}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div className="jumbotron">
	        <h1 className="display-3">PROFILE PAGE</h1>
	        <p className="lead">Cras justo odio, dapibus ac facilisis in, egestas eget quam. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
	        <p><a className="btn btn-lg btn-success" href="#" role="button">Sign up today</a></p>
	      </div>

	      <div className="row marketing" style={{ color: 'white' }}>
	        <div className="col-lg-6">
	          <h4>Username: {username}</h4>
	          <p>Email: {email}</p>

	          <h4>Type: {type}</h4>
	          <p>Activated: {activated}</p>

	          <h4>Profile Picture</h4>
	          <p>Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
	          <img src={imgUrl} />
	        </div>

	        <div className="col-lg-6">
	          <h4>Profile page</h4>
	          <p>Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum.</p>

	          <h4>Profile page</h4>
	          <p>Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus sit amet fermentum.</p>

	          <h4>Profile page</h4>
	          <p>Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
	        </div>
	      </div>
	    </div>
		);
	}
}

const stateToProps = (state) => {
	return {
		profiles: state.profiles.profiles,
		user: state.profiles.user,
	};
};

export default connect(stateToProps)(ProfileComponent);