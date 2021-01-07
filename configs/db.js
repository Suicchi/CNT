const mongoose = require('mongoose')

const connectDB = async() =>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        console.log(`MongoDB connected to ${connection.connection.host}`)
    } catch(err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB