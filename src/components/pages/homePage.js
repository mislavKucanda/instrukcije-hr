import React, { Component } from 'react';
import Const from '../../../const';

export default class HomePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			profiles: [],
			hooverCategory: '',
			selectedCategory: '',
		};

		this.renderAreas = this.renderAreas.bind(this);
		this.getProfiles = this.getProfiles.bind(this);
		this.onMouseOverCategory = this.onMouseOverCategory.bind(this);
		this.onMouseOutCategory = this.onMouseOutCategory.bind(this);
		this.onSelectCategory = this.onSelectCategory.bind(this);
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

	renderAreas() {
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
				this.setState({ profiles: res.results });
				console.log(this.state);
			}
		});
	}

	renderProfiles() {
		const { profiles } = this.state;
		return (
			<div className="card-columns">
				{profiles.map((profile, index) => {
					if(this.state.selectedCategory === '' || profile.category.includes(this.state.selectedCategory))
						return(
							<div className="card" key={index}>
	    					<img className="card-img-top img-fluid" src={profile.imgUrl} alt="" />
	    					<div className="card-block p-2">
	      					<h4 className="card-title">{profile.username}</h4>
	      					<p className="card-text">{profile.description}</p>
	      					<p className="card-text">Lokacija: {profile.address}</p>
	      					<p className="card-text">Kontakt: {profile.email} {profile.mobilePhone}</p>
	    					</div>
	  					</div>
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
	      {this.renderAreas()}
	      <p className="text-center mb-0 mt-3">ODABERI INSTRUKTORA</p>
				<hr className="mt-0" />
				{this.renderProfiles()}
	    </div>
		);
	}
}