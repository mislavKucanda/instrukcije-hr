var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ReservationSchema = new Schema({
	mentorUsername: { type: String, required: true },
	studentUsername: { type: String, default: '' },
	date: { type: Date, required: true },
	hour: { type: Number, required: true },
	reserved: { type: Boolean, default: false },
});

module.exports = mongoose.model('ReservationSchema', ReservationSchema); 