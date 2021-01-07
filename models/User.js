const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
        trim:true
    },
    salt: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

UserSchema.methods.verifyPassword = function(password) {
    // console.log('checking pass')
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)