var Reservation = require('../models/Reservation');

module.exports = {

	find: function(params, callback) {
		Reservation.find(params, function(err, reservations) {
			if(err) {
				callback(err, null);
				return;
			}
			callback(null, reservations);
		}); 
	},

	findById: function(id, callback) {
		Reservation.findById(id, function(err, reservation) {
			if(err) {
				callback(err, null);
			} else {
				callback(null, reservation);
			}
		});
	},

	create: function(params, callback) {
		Reservation.create(params, function(err, reservation) {
			if(err) {
				callback(err, null);
			} else {
				callback(null, reservation);
			}
		});
	},

	update: function(id, params, callback) {
		Reservation.findByIdAndUpdate(id, params, {new:true}, function(err, reservation) {
			if(err) {
				callback(err, null);
			} else {
				callback(null, reservation);
			}
		});
	},

	updateWithoutId: function(reservation, callback) {
		Reservation.update({  
			mentorUsername: reservation.mentorUsername,
			day: reservation.day,
			month: reservation.month,
			year: reservation.year,
			termin: reservation.termin,
		}, { $set: { studentUsername: reservation.studentUsername, status: reservation.status }}, callback);
	},

	delete: function(id, callback) {
		Reservation.findByIdAndRemove(id, function(err) {
			if(err) {
				callback(err, null);
			} else {
				callback(null, null);
			}
		});
	},
};
