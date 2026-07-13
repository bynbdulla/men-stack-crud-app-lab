const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    name: String ,
    totalPages : Number,
    LikeIt: Boolean ,
    status: String , 
})

const book = mongoose.model('book', bookSchema)

module.exports = book