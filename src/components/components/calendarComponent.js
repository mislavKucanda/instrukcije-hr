import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getDayNumbersOfCurrentWeek } from '../../../static';
import Const from '../../../const';

class Calendar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentDate: {},
			dayNumbersOfCurrentWeek: [],
		}
	}

	componentDidMount() {
		this.setState({ dayNumbersOfCurrentWeek: getDayNumbersOfCurrentWeek(new Date()) });
		this.setState({ currentDate: new Date() });
	}

	render() {
		const { user } = this.props;
		const { dayNumbersOfCurrentWeek, currentDate } = this.state;
		console.log(dayNumbersOfCurrentWeek);
		return (
			<div className="row">
				<div className="col">
					<div style={{ height: '90px' }}>
						<p className="text-right" style={{ fontSize: '2rem', color: '#9D9FA2' }}>{'<'}</p>
					</div>
					{Const.terminsInADay.map((termin, index) => {
						return (
							<div className="text-right" key={index} style={{ height: '80px' }}>
								{termin}
							</div>
						);
					})}
				</div>
				{dayNumbersOfCurrentWeek.map((day, index) => {
					const isCurrentDay = currentDate.getDate() === day.weekNumber;
					return(
						<div className="col px-0" key={index}>
							<div 
								className="text-center" 
								style={{ 
									borderStyle: 'solid', 
									borderColor: '#9D9FA2', 
									borderTopColor: isCurrentDay ? '#5c9b8e' : '#9D9FA2',
									borderWidth: '1px', 
									borderTopWidth: isCurrentDay ? '4px' : '1px',
									borderRightWidth: day.weekNumber % 2 === 0 ? '1px' : '0px', 
									borderLeftWidth: day.weekNumber % 2 === 0 ? '1px' : '0px',
									backgroundColor: isCurrentDay ? 'white' : null,
									height: isCurrentDay ? '89px' : '90px',
								}}
							>
								<p className="mb-0" style={{ fontSize: '2rem' }}>{day.weekNumber}</p>
								<p style={{ fontSize: '1.2rem' }}>{day.weekDay}</p> 
							</div>
							{Const.terminsInADay.map((termin, index) => {
								return (
									<div 
										key={index} 
										style={{ 
											height: '80px',
											borderStyle: 'solid', 
											borderColor: '#9D9FA2',
											borderWidth: '1px',
											borderRightWidth: day.weekNumber % 2 === 0 ? '1px' : '0px', 
											borderLeftWidth: day.weekNumber % 2 === 0 ? '1px' : '0px',
											backgroundColor: isCurrentDay ? 'white' : null,
										}}>
										
									</div>
								);
							})}
						</div>
					);
				})}
				<div className="col">
					<p style={{ fontSize: '2rem', color: '#9D9FA2' }}>{'>'}</p>
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

export default connect(stateToProps)(Calendar);