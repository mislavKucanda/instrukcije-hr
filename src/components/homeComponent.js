import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import actions from '../actions';
import Const from '../../const';

class HomeComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hooverCategory: '',
			selectedCategory: '',
		};

		this.renderCategories = this.renderCategories.bind(this);
		this.getProfiles = this.getProfiles.bind(this);
		this.onMouseOverCategory = this.onMouseOverCategory.bind(this);
		this.onMouseOutCategory = this.onMouseOutCategory.bind(this);
		this.onSelectCategory = this.onSelectCategory.bind(this);
		this.renderProfileInfo = this.renderProfileInfo.bind(this);
		this.renderProfileImage = this.renderProfileImage.bind(this);
	}

	componentDidMount() {
		this.getProfiles();
	}

	onMouseOverCategory(element, label) {
		this.setState({ hooverCategory: label });
	}

	onMouseOutCategory() {
		this.setState({ hooverCategory: '' });
	}

	onSelectCategory(element, label) {
		if(label === this.state.selectedCategory)
			this.setState({ selectedCategory: '' });
		else
			this.setState({ selectedCategory: label });
	}

	renderCategories() {
		return(
			<div className="row">
	      {Const.categories.map((category, index) => {
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
 							onClick={(elem) => this.onSelectCategory(elem, category.label)}
 							key={index}
 							style={{ backgroundColor }}
 						>
	        		<img src={category.url} style={{ opacity: opacityLevel }} className="img-fluid p-2" />
	        		<p className="text-center">{category.label}</p>
	        	</div>
	      	);
	      })}
	    </div>
		);
	}

	getProfiles() {
		fetch('http://localhost:3000/api/user?type=instruktor', {
			method: 'get',
			headers: {
    		'Accept': 'application/json, text/plain, */*',
    		'Content-Type': 'application/json'
  		},
		}).then(res => res.json())
		.then(res => {
			if(res.confirmation === 'success') {
				this.props.getAllProfiles(res.results);
			}
		});
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

	renderProfileImage(imgUrl) {
		if(imgUrl !== null && imgUrl !== '') {
			return <img className="card-img-top img-fluid" src={imgUrl} alt="" />
		}
		return null;
	}

	renderProfiles() {
		const { profiles } = this.props;
		return (
			<div className="card-columns">
				{profiles.map((profile, index) => {
					if(this.state.selectedCategory === '' || profile.category.includes(this.state.selectedCategory))
						return(
							<Link to={"/profil/" + profile._id} key={index}>
								<div className="card mb-3" key={index}>
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
	  					</Link>
						);
				})}
  		</div>
		);
	}

	render() {
		return(
			<div className="container px-5">
				<p className="text-center mb-0 mt-4">ODABERI PODRUČJE</p>
				<hr className="mt-0" />
		    {this.renderCategories()}
		    <p className="text-center mb-0 mt-3">ODABERI INSTRUKTORA</p>
				<hr className="mt-0" />
				{this.renderProfiles()}
		   </div>
		);
	}
}

const stateToProps = (state) => {
	return {
		profiles: state.profiles.profiles
	};
};

const dispatchToProps = (dispatch) => {
	return {
		getAllProfiles: (profiles) => dispatch(actions.getAllProfiles(profiles)),
	}
};

export default connect(stateToProps, dispatchToProps)(HomeComponent);
