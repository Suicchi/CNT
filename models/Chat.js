const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    chatMsg :{
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    room: {
        type: String,
        enum: ['pubroom'],
        default: 'pubroom'
    },
    sentOn : {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Chat', ChatSchema)