import Const from './const';

//For given date function returns array of day numbers
//for the week from monday to sunday or from sunday to saturday
//For example getDayNumbersOfCurrentWeek(new Date())
export function getDayNumbersOfCurrentWeek(date) {

	// dayNumberInWeek = 1 for monday, ... , 7 for sunday
	const dayNumberInWeek = date.getDay() === 0 ? 7 : date.getDay();

	date.setDate(date.getDate() - dayNumberInWeek + 1);

	let dayNumbersOfCurrentWeek = [];

	for(let i = 0; i < 7; i++) {
		dayNumbersOfCurrentWeek.push({
			weekDay: Const.labelsOfWeekDays[i],
			weekNumber: date.getDate(),
		});
		date.setDate(date.getDate() + 1);
	}

	return dayNumbersOfCurrentWeek;
}
