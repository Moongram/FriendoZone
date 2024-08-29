const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true, 
  },
  created: {
    type: Date,
    required: [true, 'Created date is required']
  },
  salt: {
    type: String,
    required: [true, 'Salt is required']
	},
	hash: {
			type: String,
			required: [true, 'Hash is required']
	},
	following: [{
			type: String
	}]
})

module.exports = userSchema;