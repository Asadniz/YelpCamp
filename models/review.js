const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const ReviewSchema = new Schema({
    rating: Number,
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

})

module.exports = mongoose.model('Review', ReviewSchema)