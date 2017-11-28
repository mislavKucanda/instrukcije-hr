import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getDayNumbersOfCurrentWeek } from '../../../static';
import Const from '../../../const';

class Calendar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentDate: {},
			currentDateForCalendar: {},
			dayNumbersOfCurrentWeek: [],
			dayInWeekHoovered: 0,
			terminInDayHoovered: [],
			currentAuthomatizationValue: 0,
			hooveredAuthomatizationValue: -1,
			hooveredLeftRight: '',
			//terminStatus: [][],
		}

		this.renderAuthomatizationSelectValue = this.renderAuthomatizationSelectValue.bind(this);
		this.renderCalendarLegend = this.renderCalendarLegend.bind(this);
		this.renderCalendarNavButton = this.renderCalendarNavButton.bind(this);
	}

	componentDidMount() {
		this.setState({ dayNumbersOfCurrentWeek: getDayNumbersOfCurrentWeek(new Date()) });//, () => {
			//dayNumbersOfCurrentWeek.map(() => {

			//});
		//});
		this.setState({ currentDate: new Date() });
		this.setState({ currentDateForCalendar: new Date() });
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
		const { hooveredLeftRight, currentDateForCalendar } = this.state;
		return (
			<div 
				className="center-block text-center d-inline-block" 
				style={{ 
					borderRadius:'50%', 
					float: buttonType === 'left' ? 'right' : 'left',
					backgroundColor: hooveredLeftRight === buttonType ? '#5c9b8e' : '#f1f2f2', 
					width: 40, 
					height: 40, 
					fontSize: 23, 
					color: hooveredLeftRight === buttonType ? 'white' : '#9D9FA2', 
					paddingBottom: 10,
					cursor: 'pointer', 
				}}
				onMouseOver={() => this.setState({ hooveredLeftRight: buttonType })} 
        onMouseOut={() => this.setState({ hooveredLeftRight: '' })}
				onClick={() => {
					let date = currentDateForCalendar;
					if(buttonType === 'left') 
						date.setDate(date.getDate() - 7);
					else if(buttonType === 'right')
						date.setDate(date.getDate() + 7);
					var copiedDate = new Date(date.getTime());
					this.setState({ currentDateForCalendar: date }, 
						this.setState({ dayNumbersOfCurrentWeek: getDayNumbersOfCurrentWeek(copiedDate) }));		
				}}
			>
				<span>{buttonSign}</span>
			</div>
		);
	}

	render() {
		const { user } = this.props;
		const { dayNumbersOfCurrentWeek, currentDate, hooveredLeftRight } = this.state;
		let borderConst = 1;
		if(dayNumbersOfCurrentWeek != null && dayNumbersOfCurrentWeek.length !== 0) {
			const firstDateisEven = dayNumbersOfCurrentWeek[0].weekNumber % 2 === 0;
			if(firstDateisEven)
				borderConst = 0;
			else
				borderConst = 1;
		}
		return (
			<div className="row mb-3 mx-0">
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
										borderRightWidth: day.weekNumber % 2 === borderConst ? '1px' : '0px', 
										borderLeftWidth: day.weekNumber % 2 === borderConst ? '1px' : '0px',
										backgroundColor: isCurrentDay ? 'white' : null,
										height: isCurrentDay ? '89px' : '90px',
									}}
								>
									<p className="mb-0" style={{ fontSize: '2rem' }}>{day.weekNumber}</p>
									<p style={{ fontSize: '1.2rem' }}>{day.weekDay}</p> 
								</div>
								{Const.terminsInADay.map((termin, index) => {
									var backgroundSelectedColor = isCurrentDay ? 'white' : null;
									if(day.weekNumber === this.state.dayInWeekHoovered
										&& termin === this.state.terminInDayHoovered)
										backgroundSelectedColor = '#91CCBF';
									//if(day.status === 'free')
										//backgroundSelectedColor = '#36B39C';
									//if(day.status === 'reserved')
										//backgroundSelectedColor = '#F3D271';
									return (
										<div 
											key={index} 
											style={{ 
												height: '80px',
												borderStyle: 'solid', 
												borderColor: '#9D9FA2',
												borderWidth: '1px',
												borderRightWidth: day.weekNumber % 2 === borderConst ? '1px' : '0px', 
												borderLeftWidth: day.weekNumber % 2 === borderConst ? '1px' : '0px',
												backgroundColor: backgroundSelectedColor,
											}}
											onMouseOver={() => this.setState({ 
												dayInWeekHoovered: day.weekNumber, 
												terminInDayHoovered: termin, 
											})} 
	              			onMouseOut={() => this.setState({ 
												dayInWeekHoovered: 0, 
												terminInDayHoovered: '', 
											})} 
											onClick={() => this.setState({
												freeTermins: this.state.freeTermins.push({  }),
											})}
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
		);
	}
}

const stateToProps = (state) => {
	return {
		user: state.profiles.user,
	};
};

export default connect(stateToProps)(Calendar);