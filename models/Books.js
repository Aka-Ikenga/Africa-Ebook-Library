const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    year: Number,
    genre: String,
    description: String
});

module.exports = mongoose.model('Books', BookSchema);
