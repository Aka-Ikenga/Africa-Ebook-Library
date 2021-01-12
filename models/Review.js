const mongoose = require('mongoose');


const ReviewSchema = new mongoose.Schema({
    text: String,
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User'
    }
}, {timestamps: true})

module.exports = mongoose.model('Review', ReviewSchema)
