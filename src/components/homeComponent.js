import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import ProfileCard from './components/profileCard';
import actions from '../actions';
import Const from '../../const';

class HomeComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hooverCategory: '',
			selectedCategory: '',
			hoveredPageNum: 0,
		};

		this.renderCategories = this.renderCategories.bind(this);
		this.getProfiles = this.getProfiles.bind(this);
		this.onMouseOverCategory = this.onMouseOverCategory.bind(this);
		this.onMouseOutCategory = this.onMouseOutCategory.bind(this);
		this.onSelectCategory = this.onSelectCategory.bind(this);
		this.redirectToPage = this.redirectToPage.bind(this);
		this.renderPagingNumbers = this.renderPagingNumbers.bind(this);
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

	redirectToPage(pageNum) {
		this.props.history.push('/' + pageNum);
		window.scrollTo(0, 0);
	}

	renderProfiles() {
		const { profiles } = this.props;
		const currentPage = this.props.currentPage || 1; 
		let profilesOnThisPage = profiles.slice(
			(currentPage - 1) * Const.numOfProfilesPerPage, 
			currentPage * Const.numOfProfilesPerPage
		);
		return (
			<div className="card-columns">
				{profilesOnThisPage.map((profile, index) => {
					if(this.state.selectedCategory === '' || profile.category.includes(this.state.selectedCategory))
						return(
								<Link to={"/profil/" + profile._id} key={index}>
									<ProfileCard profile={profile} />
	  						</Link>
						);
				})}
  		</div>
		);
	}

	renderPagingNumbers() {
		let { currentPage } = this.props;
		const numOfProfiles = this.props.profiles.length;
		const numOfPages = Math.ceil(numOfProfiles / Const.numOfProfilesPerPage);

		//if currentPage from url is not a number, set currentPage to 1
		currentPage = parseInt(currentPage) || 1;

		//if currentPage > numOfPages redirect to first page
		if(parseInt(currentPage) > numOfPages || parseInt(currentPage) < 0) {
			currentPage = 1;
		}

		let pageNumberArray = [];
		for(let i = 1; i <= numOfPages; i++) {
			pageNumberArray.push(i);
		}
		
		return(
			<div className="d-flex justify-content-center my-5">
				{pageNumberArray.map((num, index) => {
					if(currentPage == (index+1)) {
						return(
							<div 
								key={index}
								className="mx-2 center-block text-center" 
								style={{ borderRadius:'50%', backgroundColor:'#5c9b8e', width:30, height:30, fontSize:19, color:'white' }}
							>
							<span>{index+1}</span>
							</div>
						);
					} else {
						return(
							<div 
								key={index}
								onMouseOver={() => this.setState({ hoveredPageNum: index+1 })} 
              	onMouseOut={() => this.setState({ hoveredPageNum: 0 })}
								onClick={() => this.redirectToPage(index+1)}
								className="mx-2 center-block text-center" 
								style={{ 
									borderRadius: '50%', 
									backgroundColor: (this.state.hoveredPageNum === index + 1 ? '#36B39C' : '#f1f2f2'), 
									color: (this.state.hoveredPageNum === index + 1 ? 'white' : '#212529'),
									width: 30, 
									height: 30, 
									fontSize: 19 
								}}
							>
							<span>{index+1}</span>
							</div>
						);
					}
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
				{this.renderPagingNumbers()}
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
