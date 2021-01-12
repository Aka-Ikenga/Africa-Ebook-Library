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
    branch: String,
    summary:{
        type: String,
    },
    isbn:{
      type: Number,
    },
    pages: Number,
    imageUrl: String,
    fileUrl: String,
    fileType: String,
    ratings: {
        type: Number,
        default: 3
    },
    authors: [{
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Author'
    }],
    review: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Review'
        }
    ]
}, {timestamps: true});

module.exports = mongoose.model('Books', BookSchema);
