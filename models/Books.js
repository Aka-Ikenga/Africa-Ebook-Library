const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title:{
        type: String,
        index: true,
        unique: true
    },
    year: Number,
    genres: Array,
    summary:{
        type: String,
        index: true,
        unique: true
    },
    imageUrl: String,
    fileUrl: {
        type: String,
        required: true
    },
    authors: {
        type: Array,
        ref: 'Author'
    }
}, {timestamps:{ createdAt: 'created_at' }});

module.exports = mongoose.model('Books', BookSchema);
