const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
		unique: true, 
  },
  displayname: {
	type: String
  },
  headline: {
    type: String,
  },
	email: {
		type: String,
		required: [true, 'Email is required']
	},
	zipcode: {
			type: String,
			required: [true, 'Zipcode is required']
	},
	phone: {
		type: String,
		required: [true, 'Phone is required']
  },
	dob: {
		type: Number,
		required: [true, 'Date of Birth is required']
  },
	avatar: {
		type: String,
	}
})

module.exports = profileSchema;