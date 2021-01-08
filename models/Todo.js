const mongoose = require('mongoose')
const autoincrement = require('mongoose-auto-increment')

autoincrement.initialize(mongoose.connection)

const ToDoSchema = new mongoose.Schema({
    taskNo : {
        type: Number,
        unique:true
    },
    task : {
        type: String,
        required: true
    },
    author : {
        type: String,
        ref: 'User'
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
})

ToDoSchema.plugin(autoincrement.plugin, {model:'Todo', field: 'taskNo'})
module.exports = mongoose.model('Todo', ToDoSchema)