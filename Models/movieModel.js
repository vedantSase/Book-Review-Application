const mongoose = require('mongoose');

const Movie = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        unique: true,
        trim: true
    },
    "description": {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    year: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    rating: {
        type: Number
    },
    "totalRating": {
        type: Number,
        default: 0
    },
    "releaseDate": {
        type: Date
    },
    'createdAt': {
        type: Date,
        default: Date.now()
    },
    "genres": {
        type: [String],
        required: [true, 'Genres are required'],
        enum: {
            values: ['Action', 'Thriller', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi'],
            message: '{VALUE} is not a valid genre'
        }
    },
    "director": {
        type: String,
        required: [true, 'Director is required'],
        trim: true
    },
    "coverImage": {
        type: String,
        required: [true, 'Cover image is required'],
        trim: true
    },
    "actors": {
        type: [String],
        required: [true, 'Actors are required'],
        trim: true
    },
    "price": {
        type: Number,
        required: [true, 'Price is required']
    }
})

module.exports = mongoose.model('movie', Movie);