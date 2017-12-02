import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getDayNumbersOfCurrentWeek } from '../../../static';
import Const from '../../../const';
import CalendarLabel from './calendarLabelComponent';

class Calendar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentDate: {},
			currentDateForCalendar: {},
			daysInCurrentWeek: [],
			hooveredDay: {},
			currentAuthomatizationValue: 0,
			hooveredAuthomatizationValue: -1,
			hooveredLeftRightNavButton: '',
			freeTermins: [],
		}

		this.renderAuthomatizationSelectValue = this.renderAuthomatizationSelectValue.bind(this);
		this.renderCalendarLegend = this.renderCalendarLegend.bind(this);
		this.renderCalendarNavButton = this.renderCalendarNavButton.bind(this);
		this.createFreeTermin = this.createFreeTermin.bind(this);
		this.terminIsFree = this.terminIsFree.bind(this);
	}

	componentDidMount() {
		this.setState({ daysInCurrentWeek: getDayNumbersOfCurrentWeek(new Date()) });
		this.setState({ currentDate: new Date() });
		this.setState({ currentDateForCalendar: new Date() });
	}

	createFreeTermin() {
		const { user } = this.props;
		const { hooveredDay } = this.state;

		const reservation = {
			mentorUsername: user.username,
			day: hooveredDay.day,
			month: hooveredDay.month,
			year: hooveredDay.year,
			termin: hooveredDay.termin,
		}

		fetch('http://localhost:3000/api/reservation', {
 			method: 'post',
  		headers: {
    		'Accept': 'application/json, text/plain, */*',
    		'Content-Type': 'application/json'
  		},
  		credentials: 'include',
  		body: JSON.stringify(reservation)
		}).then(res => res.json())
  		.then(res => {
  			if(res.confirmation === 'success') {
  				var freeTermins = this.state.freeTermins.slice()
					freeTermins.push(res.result)
					this.setState({ freeTermins: freeTermins })
  			} else {
  				console.log('ERROR');
  				console.log(res.result);
  			} 
  		});
	}

	terminIsFree(day, termin) {
		const { freeTermins } = this.state;
		for(var i = 0; i < freeTermins.length; i++) {
			if(
				freeTermins[i].day === day.day &&
				freeTermins[i].termin === termin
			) {
				return true;
			}
		}	
		return false;
	}	

	renderAuthomatizationSelectValue(value) {
		const { currentAuthomatizationValue, hooveredAuthomatizationValue } = this.state;
		return (
			currentAuthomatizationValue === value
			? (
				<div 
					key={value}
					className="center-block text-center d-inline-block" 
					style={{ borderRadius:'50%', backgroundColor:'#5c9b8e', width:30, height:30, fontSize:19, color:'white' }}
				>
					<span>{value}</span>
				</div>
			) : (
				<div 
					key={value}
					className="center-block text-center d-inline-block" 
					style={{ 
						borderRadius:'50%', 
						backgroundColor: hooveredAuthomatizationValue === value ? '#91CCBF' : '#f1f2f2', 
						width:30, 
						height:30, 
						fontSize:19, 
						color: hooveredAuthomatizationValue === value ? 'white' : '#212529', 
						cursor: 'pointer', 
					}}
					onMouseOver={() => this.setState({ hooveredAuthomatizationValue: value })} 
          onMouseOut={() => this.setState({ hooveredAuthomatizationValue: -1 })}
					onClick={() => this.setState({ currentAuthomatizationValue: value })}
				>
					<span>{value}</span>
				</div>
			)
		);
	}

	renderCalendarLegend() {
		return (
			<div className="pl-3 pt-5">
				<div style={{ width: '100%', overflow: 'hidden' }}>
					<div
						className="mt-2"
						style={{ width:25, height:25, backgroundColor: '#36B39C', float: 'left' }}	
					></div>
					<div className="mt-2" style={{ marginLeft: 36 }}>
						<p className="mb-0">Termin je slobodan</p>
					</div>
				</div>
				<div className="mt-2" style={{ width: '100%', overflow: 'hidden' }}>
					<div
						className="mt-2"
						style={{ width:25, height:25, backgroundColor: '#F0C949', float: 'left' }}	
					></div>
					<div className="mt-2" style={{ marginLeft: 36 }}>
						<p className="mb-0">Termin je zauzet</p>
					</div>
				</div>
			</div>
		);
	}

	renderCalendarNavButton(buttonType, buttonSign) {
		const { hooveredLeftRightNavButton, currentDateForCalendar } = this.state;
		return (
			<div 
				className="center-block text-center d-inline-block" 
				style={{ 
					borderRadius:'50%', 
					float: buttonType === 'left' ? 'right' : 'left',
					backgroundColor: hooveredLeftRightNavButton === buttonType ? '#5c9b8e' : '#f1f2f2', 
					width: 40, 
					height: 40, 
					fontSize: 23, 
					color: hooveredLeftRightNavButton === buttonType ? 'white' : '#9D9FA2', 
					paddingBottom: 10,
					cursor: 'pointer', 
				}}
				onMouseOver={() => this.setState({ hooveredLeftRightNavButton: buttonType })} 
        onMouseOut={() => this.setState({ hooveredLeftRightNavButton: '' })}
				onClick={() => {
					let date = currentDateForCalendar;
					if(buttonType === 'left') 
						date.setDate(date.getDate() - 7);
					else if(buttonType === 'right')
						date.setDate(date.getDate() + 7);
					var copiedDate = new Date(date.getTime());
					this.setState({ currentDateForCalendar: date }, 
						this.setState({ daysInCurrentWeek: getDayNumbersOfCurrentWeek(copiedDate) }));		
				}}
			>
				<span>{buttonSign}</span>
			</div>
		);
	}

	render() {
		const { user } = this.props;
		const { daysInCurrentWeek, currentDate, hooveredDay } = this.state;
		return (
			<div className="mx-0">
				<CalendarLabel startDate={daysInCurrentWeek[0]} endDate={daysInCurrentWeek[6]} />
				<div className="row mb-3 mx-0 mt-2">
					<div className="col-1">
						<div style={{ height: '90px', width: '100%', overflow: 'hidden' }}>
							{this.renderCalendarNavButton('left', '<')}
						</div>
						{Const.terminsInADay.map((termin, index) => {
							return (
								<div className="text-right" key={index} style={{ height: '80px' }}>
									{termin}
								</div>
							);
						})}
					</div>
					<div className="col-8">
						<div className="row">
						{daysInCurrentWeek.map((day, index) => {
							const isCurrentDay = (
								currentDate.getDate() === day.day &&
								currentDate.getMonth() === day.month &&
								currentDate.getFullYear() === day.year
							);
							const indexCopy = index;
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
											borderRightWidth: indexCopy % 2 === 0 ? '1px' : '0px', 
											borderLeftWidth: indexCopy % 2 === 0 ? '1px' : '0px',
											backgroundColor: isCurrentDay ? 'white' : null,
											height: isCurrentDay ? '89px' : '90px',
										}}
									>
										<p className="mb-0" style={{ fontSize: '2rem' }}>{day.day}</p>
										<p style={{ fontSize: '1.2rem' }}>{day.dayLabel}</p> 
									</div>
									{Const.terminsInADay.map((termin, index) => {
										var backgroundSelectedColor = isCurrentDay ? 'white' : null;
										if(Object.keys(hooveredDay).length !== 0 && 
											day.day === hooveredDay.day &&
											termin === hooveredDay.termin)
											backgroundSelectedColor = '#91CCBF';
										if(this.terminIsFree(day, termin))
											backgroundSelectedColor = '#36B39C';
										return (
											<div 
												key={index} 
												style={{ 
													height: '80px',
													borderStyle: 'solid', 
													borderColor: '#9D9FA2',
													borderWidth: '1px',
													borderRightWidth: indexCopy % 2 === 0 ? '1px' : '0px', 
													borderLeftWidth: indexCopy % 2 === 0 ? '1px' : '0px',
													backgroundColor: backgroundSelectedColor,
												}}
												onMouseOver={() => this.setState({ 
													hooveredDay: { 
														day: day.day,
														month: day.month,
														year: day.year, 
														termin, 
													} 
												})} 
		              			onMouseOut={() => this.setState({ 
													hooveredDay: {}
												})} 
												onClick={this.createFreeTermin}
											>
												
											</div>
										);
									})}
								</div>
							);
						})}
						</div>
					</div>
					<div className="col-3 px-0">
						<div style={{ height: '90px', width: '100%', overflow: 'hidden', paddingLeft: 15 }}>
							{this.renderCalendarNavButton('right', '>')}
						</div>
						<div className="pl-3">
							<p>Slobodni termin postavi na sljedećih:</p>
							<div className="d-inline-block">
								{this.renderAuthomatizationSelectValue(0)}
								{this.renderAuthomatizationSelectValue(1)}
								{this.renderAuthomatizationSelectValue(2)}
								{this.renderAuthomatizationSelectValue(3)}
								{this.renderAuthomatizationSelectValue(4)}
								<div 
									className="center-block text-center d-inline-block pl-2" 
									style={{ borderRadius:'50%', backgroundColor:'#f1f2f2', width:30, color:'#212529' }}
								>
									<span>tjedana.</span>
								</div>
							</div>
						</div>
						{this.renderCalendarLegend()}
					</div>
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