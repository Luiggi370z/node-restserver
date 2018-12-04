const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required.']
	},
	price: {
		type: Number,
		required: [true, 'Price is required.']
	},
	description: {
		type: String
	},
	available: {
		type: Boolean,
		default: true,
		required: true
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
})

module.exports = mongoose.model('Product', ProductSchema)
