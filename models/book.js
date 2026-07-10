const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    name: {type: String, required: true},
    totalPages : {type: Number, required: true},
    LikeIt: Boolean ,
    status: String , 
})

const book = mongoose.model('book', bookSchema)

module.exports = book