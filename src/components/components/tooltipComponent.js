import React, { Component } from 'react';

export default class TooltipComponent extends Component {
	render() {
		const { infoList, imgUrl } = this.props;
		console.log(infoList);
		return(
			<div>
				{imgUrl ? <img src={imgUrl} style={{ width:100, height:100 }} /> : null}
				{infoList.map((info, index) => { return <p key={index}>{info}</p> })}
			</div>
		);
	}
}
