import Vue from 'vue';
import moment from 'moment';

Vue.filter('date', (dateString, format = 'D. M. YYYY H:mm') => {
	let givenDate = moment(dateString),
		currentDate = moment();
	if (format === 'simple') {
		let secondsDifference = currentDate.diff(givenDate, 'seconds'),
			minutesDifference = currentDate.diff(givenDate, 'minutes'),
			hoursDifference = currentDate.diff(givenDate, 'hours'),
			daysDifference = currentDate.diff(givenDate, 'days');
		if (daysDifference >= 5) {
			return givenDate.format('D. M. YYYY');
		} else if (daysDifference >= 1) {
			return `${daysDifference}d`;
		} else if (minutesDifference >= 59) {
			return `${hoursDifference}h`;
		} else if (secondsDifference >= 59) {
			return `${minutesDifference}m`;
		} else {
			return `${secondsDifference}s`;
		}
	} else {
		return givenDate.format(format);
	}
});
