import React, { Component } from 'react';

export default class TwoOptionsPicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedOption: 1,
			hooveredOption: 0,
		}
	}
	render() {
		const { 
			headerText, 
			optionOneText, 
			optionTwoText, 
			optionOneSelectColor, 
			optionTwoSelectColor, 
			optionOneHooverColor, 
			optionTwoHooverColor,
			optionOneFunction,
			optionTwoFunction,
		} = this.props;
		const { selectedOption, hooveredOption } = this.state;
		
		let backgroundColor1 = null;
		let backgroundColor2 = null;
		if(selectedOption === 1)
			backgroundColor1 = optionOneSelectColor;
		else if(hooveredOption === 1 && selectedOption !== 1) 
			backgroundColor1 = optionOneHooverColor;
		if(selectedOption === 2)
			backgroundColor2 = optionTwoSelectColor;
		else if(hooveredOption === 2 && selectedOption !== 2) 
			backgroundColor2 = optionTwoHooverColor;

		return(
			<div className="pb-5">
				<p>{headerText}</p>
				<div className="row pl-3">
					<div 
						className="col-lg-3 col-md-4 col-sm-5 col-xs-12 text-center px-0"
						onMouseEnter={() => { this.setState({ hooveredOption: 1 }) }}
						onMouseLeave={() => { this.setState({ hooveredOption: 0 }) }}
						onClick={() => { 
							this.setState({ selectedOption: 1 });
							optionOneFunction();
						}}
						style={{ backgroundColor: backgroundColor1, color: selectedOption === 1 || hooveredOption === 1 ? 'white' : null }}
					>
						{optionOneText}
					</div>
					<div 
						className="col-lg-3 col-md-4 col-sm-5 col-xs-12 text-center px-0"
						onMouseEnter={() => { this.setState({ hooveredOption: 2 }) }}
						onMouseLeave={() => { this.setState({ hooveredOption: 0 }) }}
						onClick={() => { 
							this.setState({ selectedOption: 2 });
							optionTwoFunction();
						}}
						style={{ backgroundColor: backgroundColor2, color: selectedOption === 2 || hooveredOption === 2 ? 'white' : null }}
					>
						{optionTwoText}
					</div>
				</div>
			</div>
		);
	}
}