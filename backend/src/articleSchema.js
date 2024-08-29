const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  pid: {
    type: Number,
    required: [true, 'Post id is required'],
		unique: true, 
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
  },
	text: {
			type: String,
			required: [true, 'Text is required']
	},
	date: {
					type: Date,
					required: [true, 'Date is required']
	},
	comments: {
		type: [{
				id: Number,
				author: String,
				message: String,
		}],
	}, 
	image: {
		type: String
	}

	})

module.exports = articleSchema;