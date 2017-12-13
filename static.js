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
			dayLabel: Const.labelsOfWeekDays[i],
			day: date.getDate(),
			month: date.getMonth(),
			year: date.getFullYear(),
		});
		date.setDate(date.getDate() + 1);
	}

	return dayNumbersOfCurrentWeek;
}

export function dateIsNotInPast(day, month, year) {
		const currentDate = new Date();
		const selectedDate = new Date(year, month, day, 23, 59, 59); 
		return selectedDate.getTime() >= currentDate.getTime();
}
