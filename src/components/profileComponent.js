import React, { Component } from 'react';
import { connect } from 'react-redux';

import Calendar from './components/calendarComponent';

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
				this.props.history.push('/prijava');
			else
				this.setState({ profile: user });
		}
		window.scrollTo(0, 0);
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
		//I am not sure if this ever worked, check again when you will have more time.
		if(this.state.profile == null) {
			return(<div></div>);
		}
		const { username, email, password, type, activated, imgUrl } = this.state.profile;
		return(
			<div>
				<div className="row mx-0 mt-1">
					<div className="col-1">
					</div>
					<div className="col-10 pl-0">
					<div className="row">
						<div className="col-lg-3 col-md-3 mt-3 mb-0">
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
					<div className="row">
						<div className="col-1"></div>
						<p className="col-8 text-center mb-0 mt-0">KALENDAR ZA REZERVACIJE TERMINA</p>
						<div className="col-3"></div>
					</div>
					<hr className="mt-0" style={{ borderColor: '#9D9FA2' }} />
				</div>
				<div className="col-1 pr-0">
				</div>
			</div>
			<div className="mt-1">
				<Calendar profileId={this.props.profileId}/>
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