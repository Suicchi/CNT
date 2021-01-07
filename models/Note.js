const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body :{
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['public', 'private'],
        default: 'private'
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Note', NoteSchema)