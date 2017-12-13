import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getDayNumbersOfCurrentWeek, dateIsNotInPast } from '../../../static';
import Const from '../../../const';
import CalendarLabel from './calendarLabelComponent';
import TwoOptionsPicker from './twoOptionsPicker';

class Calendar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentDate: {},
			currentDateForCalendar: {},
			daysInCurrentWeek: [],
			hooveredDay: {},
			hooveredForReservedDay: {},
			currentAuthomatizationValue: 0,
			hooveredAuthomatizationValue: -1,
			hooveredLeftRightNavButton: '',
			freeTermins: [],
			profileUsername: '',
			hooveredForDeleteReservedDay: {},
		}

		this.renderAuthomatizationSelectValue = this.renderAuthomatizationSelectValue.bind(this);
		this.renderCalendarLegend = this.renderCalendarLegend.bind(this);
		this.renderCalendarNavButton = this.renderCalendarNavButton.bind(this);
		this.createFreeTermin = this.createFreeTermin.bind(this);
		this.deleteFreeTermin = this.deleteFreeTermin.bind(this);
		this.terminIsFree = this.terminIsFree.bind(this);
		this.getFreeTermins = this.getFreeTermins.bind(this);
		this.reserveFreeTermin = this.reserveFreeTermin.bind(this);
		this.unReserveFreeTermin = this.unReserveFreeTermin.bind(this);
	}

	componentDidMount() {
		this.setState({ daysInCurrentWeek: getDayNumbersOfCurrentWeek(new Date()) });
		this.setState({ currentDate: new Date() });
		this.setState({ currentDateForCalendar: new Date() });
		this.getFreeTermins();
	}

	getFreeTermins() {
		const { user, profileId } = this.props;
		
		let username;
		if(profileId == null)
			username = user.username;
		else 
			username = this.props.profiles.find((elem) => { 
				return elem._id === this.props.profileId 
			}).username;
		fetch('http://localhost:3000/api/reservation?mentorUsername=' + username, {
			method: 'get',
			headers: {
    		'Accept': 'application/json, text/plain, */*',
    		'Content-Type': 'application/json'
  		},
		}).then(res => res.json())
		.then(res => {
			if(res.confirmation === 'success') {
				this.setState({ freeTermins: res.results });
				this.setState({ profileUsername: username });
			}
		});
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

	reserveFreeTermin() {
		const { hooveredForReservedDay, profileUsername } = this.state;
		const { user } = this.props;
		const reservation = {
			mentorUsername: profileUsername,
			studentUsername: user.username,
			day: hooveredForReservedDay.day,
			month: hooveredForReservedDay.month,
			year: hooveredForReservedDay.year,
			termin: hooveredForReservedDay.termin,
			status: 'reserved',
		};
		fetch('http://localhost:3000/api/reservation', {
 			method: 'put',
  		headers: {
    		'Accept': 'application/json, text/plain, */*',
    		'Content-Type': 'application/json'
  		},
  		credentials: 'include',
  		body: JSON.stringify(reservation)
		}).then(res => res.json())
  		.then(res => {
  			if(res.confirmation === 'success') {
  				var newFreeTermins = [];
  				this.state.freeTermins.map(termin => {
  					if(termin.day === reservation.day &&
  						termin.month === reservation.month &&
  						termin.termin === reservation.termin &&
  						termin.mentorUsername === reservation.mentorUsername) {
  						reservation._id = termin._id;
  						newFreeTermins.push(reservation);
  					} else {
  						newFreeTermins.push(termin);
  					}
  				});
					this.setState({ freeTermins: newFreeTermins })
  			} else {
  				console.log('ERROR');
  				console.log(res.result);
  			} 
  		});
	}

	unReserveFreeTermin() {
		const { hooveredForDeleteReservedDay, profileUsername } = this.state;
		const reservation = {
			mentorUsername: profileUsername,
			studentUsername: '',
			day: hooveredForDeleteReservedDay.day,
			month: hooveredForDeleteReservedDay.month,
			year: hooveredForDeleteReservedDay.year,
			termin: hooveredForDeleteReservedDay.termin,
			status: 'free',
		};
		fetch('http://localhost:3000/api/reservation', {
 			method: 'put',
  		headers: {
    		'Accept': 'application/json, text/plain, */*',
    		'Content-Type': 'application/json'
  		},
  		credentials: 'include',
  		body: JSON.stringify(reservation)
		}).then(res => res.json())
  		.then(res => {
  			if(res.confirmation === 'success') {
  				var newFreeTermins = [];
  				this.state.freeTermins.map(termin => {
  					if(termin.day === reservation.day &&
  						termin.month === reservation.month &&
  						termin.termin === reservation.termin &&
  						termin.mentorUsername === reservation.mentorUsername) {
  						reservation._id = termin._id;
  						newFreeTermins.push(reservation);
  					} else {
  						newFreeTermins.push(termin);
  					}
  				});
					this.setState({ freeTermins: newFreeTermins })
  			} else {
  				console.log('ERROR');
  				console.log(res.result);
  			} 
  		});
	}

	deleteFreeTermin() {
		const { user } = this.props;
		const { hooveredDay, freeTermins } = this.state;

		const reservation = {
			mentorUsername: user.username,
			day: hooveredDay.day,
			month: hooveredDay.month,
			year: hooveredDay.year,
			termin: hooveredDay.termin,
		}

		let idToDelete;
		freeTermins.map(termin => {
			if(reservation.mentorUsername === termin.mentorUsername &&
				reservation.day === termin.day &&
				reservation.month === termin.month &&
				reservation.year === termin.year &&
				reservation.termin === termin.termin)
				idToDelete = termin._id;
		});

		if(idToDelete) {
			fetch('http://localhost:3000/api/reservation/' + idToDelete, {
	 			method: 'delete',
	  		headers: {
	    		'Accept': 'application/json, text/plain, */*',
	    		'Content-Type': 'application/json'
	  		},
	  		credentials: 'include',
	  		body: JSON.stringify(reservation)
			}).then(res => res.json())
	  		.then(res => {
	  			if(res.confirmation === 'success') {
	  				var freeTerminsUpdate = freeTermins.filter(termin => termin._id !== idToDelete);
						this.setState({ freeTermins: freeTerminsUpdate });
	  			} else {
	  				console.log(res.error);
	  			} 
	  		});
		}
	}

	terminIsFree(day, termin) {
		const { freeTermins } = this.state;
		for(var i = 0; i < freeTermins.length; i++) {
			if(
				freeTermins[i].day === day.day &&
				freeTermins[i].month === day.month &&
				freeTermins[i].year === day.year &&
				freeTermins[i].termin === termin) {
				if(freeTermins[i].status === 'free')
					return 'free';
				else if(freeTermins[i].status === 'reserved')
					return 'reserved';
			}
		}	
		return 'notFreeNotReserved';
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
			<div className="pt-5">
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
		const { daysInCurrentWeek, currentDate, hooveredDay, hooveredForReservedDay, hooveredForDeleteReservedDay } = this.state;
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
										let terminIsFree = false;
										let terminIsReserved = false;
										let terminIsHoovered = false;
										let terminIsHooveredForReservation = false;
										const dateNotInPast = dateIsNotInPast(day.day, day.month, day.year);
										var backgroundSelectedColor = isCurrentDay ? 'white' : null;
										if(Object.keys(hooveredDay).length !== 0 && 
											day.day === hooveredDay.day &&
											termin === hooveredDay.termin &&
											day.year === hooveredDay.year &&
											day.month === hooveredDay.month) {
											dateNotInPast ? backgroundSelectedColor = '#91CCBF' : backgroundSelectedColor = '#D1D3D4';
											terminIsHoovered = true;
										}
										let terminStatus = 'non';
										let studentReservedUsername = '';
										const { freeTermins } = this.state;
										for(var i = 0; i < freeTermins.length; i++) {
											if(
												freeTermins[i].day === day.day &&
												freeTermins[i].month === day.month &&
												freeTermins[i].year === day.year &&
												freeTermins[i].termin === termin) {
												if(freeTermins[i].status === 'free') {
													terminStatus = 'free';
													break;
												}
												else if(freeTermins[i].status === 'reserved')
													terminStatus = 'reserved';
													studentReservedUsername = freeTermins[i].studentUsername;
													break;
											}
										}	
										if(terminStatus === 'free') {
											backgroundSelectedColor = '#36B39C';
											terminIsFree = true;
										} else if(terminStatus === 'reserved') {
											backgroundSelectedColor = '#F3D271';
											terminIsFree = false;
											terminIsReserved = true;
										}
										if(Object.keys(hooveredForReservedDay).length !== 0 &&
											day.day === hooveredForReservedDay.day &&
											termin === hooveredForReservedDay.termin &&
											day.year === hooveredForReservedDay.year &&
											terminIsFree === true) {
											backgroundSelectedColor = '#F7E2A6';
											terminIsHooveredForReservation = true;
										}
										let hooveredForDelete = false;
										if(Object.keys(hooveredForDeleteReservedDay).length !== 0 &&
											day.day === hooveredForDeleteReservedDay.day &&
											termin === hooveredForDeleteReservedDay.termin &&
											day.year === hooveredForDeleteReservedDay.year &&
											terminIsReserved === true) {
											hooveredForDelete = true;
										}
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
													position: 'relative',
												}}
												onMouseEnter={() => {
													//if you are logged in, on your profile and you are instructor
													if((this.props.profileId == null && this.props.user.type === 'instruktor') ||
														this.props.profileId === this.props.user._id) {
														this.setState({ 
															hooveredDay: { 
																day: day.day,
																month: day.month,
																year: day.year, 
																termin, 
															} 
														});
													}
													//if you are logged in as a student, and you hoover free termin
													if(this.props.user.type === 'student' &&
														this.props.profileId !== this.props.user._id &&
														terminIsFree === true) {
														this.setState({ 
															hooveredForReservedDay: {
																day: day.day,
																month: day.month,
																year: day.year, 
																termin,
															}
														});
													}
													//if you are logged in as a student, and you hoover YOUR reserved termin
													if(this.props.user.type === 'student' &&
														this.props.profileId !== this.props.user._id &&
														terminIsFree === false &&
														terminIsReserved === true &&
														user.username === studentReservedUsername) {
														this.setState({ 
															hooveredForDeleteReservedDay: {
																day: day.day,
																month: day.month,
																year: day.year,
																termin,
															}
														});
													}
												}} 
		              			onMouseLeave={() => this.setState({ 
													hooveredDay: {},
													hooveredForReservedDay: {},
													hooveredForDeleteReservedDay: {},
												})} 
												onClick={() => { 
													//if you are logged in, on your profile and you are instructor
													if(((this.props.profileId == null && this.props.user.type === 'instruktor') ||
														this.props.profileId === this.props.user._id) && dateNotInPast) {
														if(terminStatus === 'non') {
															this.createFreeTermin();
														} else if(terminStatus === 'free') {
															this.deleteFreeTermin();
														}
													}
													//if termin is hoovered for reservation
													else if(terminIsHooveredForReservation === true)
														this.reserveFreeTermin();
													else if(hooveredForDelete === true) 
														this.unReserveFreeTermin();
												}}
											>
												{!terminIsFree && ((this.props.profileId == null && this.props.user.type === 'instruktor') ||
														this.props.profileId === this.props.user._id) && terminIsHoovered && terminStatus === 'non' && dateNotInPast
												? (
													<img src={Const.createTerminUrl} style={{ width: '40%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
												) : null}
												{terminIsHooveredForReservation
												? (
													<img src={Const.createTerminUrl} style={{ width: '40%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
												) : null}
												{terminIsFree && ((this.props.profileId == null && this.props.user.type === 'instruktor') ||
														this.props.profileId === this.props.user._id) && terminIsHoovered
												? (
													<img src={Const.deleteTerminUrl} style={{ width: '40%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
												) : null}
												{terminIsFree && !terminIsHoovered && !terminIsHooveredForReservation
												? (
													<p className="text-center" style={{ color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>{day.dayLabel}<br />{termin}</p>
												) : null}
												{terminIsReserved && !hooveredForDelete
												? (
													<p className="text-center" style={{ color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>{day.dayLabel}<br />{termin}<br />{studentReservedUsername}</p>
												) : null}
												{hooveredForDelete
												? (
													<img src={Const.deleteTerminUrl} style={{ width: '40%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
												) : null}
											</div>
										);
									})}
								</div>
							);
						})}
						</div>
					</div>
					<div className="col-3">
						<div style={{ height: '90px', width: '100%', overflow: 'hidden' }}>
							{this.renderCalendarNavButton('right', '>')}
						</div>
						<TwoOptionsPicker 
							headerText="Odaberi vrstu termina:" 
							optionOneText="Slobodni termin" 
							optionTwoText="Zauzeti termin"
							optionOneSelectColor="#36B39C"
							optionTwoSelectColor="#F3D271"
							optionOneHooverColor="#91CCBF"
							optionTwoHooverColor="#F7E2A6"
						/>
						<div>
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
		profiles: state.profiles.profiles,
		user: state.profiles.user,
	};
};

export default connect(stateToProps)(Calendar);