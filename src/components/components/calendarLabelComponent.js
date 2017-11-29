import React, { Component } from 'react';

import Const from '../../../const';

export default class CalendarLabel extends Component {

	constructor(props) {
		super(props);
		this.renderCalanderLabel = this.renderCalanderLabel.bind(this);
	}

	renderCalanderLabel() {
		const { startDate, endDate } = this.props;

		if(startDate == null || endDate == null) return '';

		if(startDate.month === endDate.month && startDate.year === endDate.year) {
			return (startDate.day + '. - ' + endDate.day + '. ' + Const.monthLabels[startDate.month] + '. ' + startDate.year);
		} else if(startDate.month !== endDate.month && startDate.year === endDate.year) {
			return (startDate.day + '. ' + Const.monthLabels[startDate.month] + '. - ' + endDate.day + '. ' + Const.monthLabels[endDate.month] + '. ' + startDate.year);
		} else if(startDate.month !== endDate.month && startDate.year !== endDate.year) {
			return (startDate.day + '. ' + Const.monthLabels[startDate.month] + '. ' + startDate.year + ' - ' + endDate.day + '. ' + Const.monthLabels[endDate.month] + '. ' + endDate.year);
		} else {
			return '';
		}
	}

	render() {
		return (
			<div className="row">
				<div className="col-1"></div>
				<div className="col-8 text-center">{this.renderCalanderLabel()}</div>
				<div className="col-3"></div>
			</div>
		);
	}
}