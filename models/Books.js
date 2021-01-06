const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title:{
        type: String,
    },
    language:{
        type: String,
        default: 'English'
    },
    year: Number,
    genres: Array,
    summary:{
        type: String,
    },
    pages: Number,
    imageUrl: String,
    fileUrl: {
        type: String
    },
    fileType: String,
    authors: [{
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Author'
    }]
}, {timestamps:{createdAt: 'created_at'}});

module.exports = mongoose.model('Books', BookSchema);
