const mongoose = require('mongoose')

let Schema = mongoose.Schema

let categorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        unique: false
    }
})

module.exports = mongoose.model('Category', categorySchema)