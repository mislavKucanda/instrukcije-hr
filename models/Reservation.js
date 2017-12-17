var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ReservationSchema = new Schema({
	mentorUsername: { type: String, required: true },
	studentUsername: { type: String, default: '' },
	day: { type: Number, required: true },
	month: { type: Number, required: true },
	year: { type: Number, required: true },
	termin: { type: String, required: true },
	status: { type: String, default: 'free' },
	message: { type: String, default: '' },
});

module.exports = mongoose.model('ReservationSchema', ReservationSchema); 