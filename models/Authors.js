const mongoose = require('mongoose');

AuthorSchema = new mongoose.Schema({
    name: String,
    gender: String,
    image: String,
    country: String,
    birthdate: Date,
    alive: Boolean,
    bio: String,
    books: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Books'
        }
    ]

}, {timestamps:{createdAt: 'created_at'}});

module.exports = mongoose.model('Author', AuthorSchema);
