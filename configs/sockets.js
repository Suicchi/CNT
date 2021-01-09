// importing required models
const Chat = require('../models/Chat')
const User = require('../models/User')

module.exports = (io) => {
    io.on('connection', (socket)=>{
        console.log(`${socket.id} connected`)

        socket.on('chatMsg', async (data) => {

            // first check if user exists
            // then neutralize the message
            // then put to db
            const user = await User.findOne({username: data.username}).select('_id username')
            if(!user) {
                console.log(`Invalid user`)
            }
            else {
                const msg = data.chatMsg.replace(/</g,'&lt;')
                                        .replace(/>/g,'&gt;')
                                        .replace(/\\/g,'&#92;')

                const newChatMSG = {
                    chatMsg : msg,
                    sender : user._id
                }

                await Chat.create(newChatMSG)
                console.log('msg stored')
                // Let all connected parties know about new message
                io.emit('newMsg', {
                    chatMsg: msg,
                    username: data.username
                })
            }
        })
        
        socket.on('disconnect', ()=>{
            console.log(`${socket.id} disconnected`)
        })
    })
}