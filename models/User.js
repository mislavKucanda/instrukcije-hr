var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: { type: String, required: true }, //moguce dodati index:true 
	password: { type: String, required: true },
	type: { type: String, required: true },
	description: { type: String, default: '' },
	address: { type: String, default: '' },
	email: { type: String, default: '' },
	mobilePhone: { type: String, default: '' },
	location: {
    type: { type: String },
    coordinates: [Number]
  },
  category: { type:[String], default: [] },
  imgUrl: { type: String, default: '' },
  activated: { type: Boolean, default: false },
  paidThisMonth: { type: Boolean, default: false },
  paidNextMonth: { type: Boolean, default: false },
  dateRegistered: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserSchema', UserSchema); 