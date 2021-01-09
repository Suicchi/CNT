const express = require('express')
// const socketConnection = require('../configs/sockets')
// express.set()
const router = express.Router()
const {ensureAuth } = require('../middleware/auth')
const Chat = require('../models/Chat')

// render the public chat view
// GET /chat
router.get('/', ensureAuth, async (req, res)=>{
    try {
        const chats = await Chat.find().populate('sender').lean()
        res.render('chat', {
            chats,
            username : req.user.username
        })
    } catch (error) {
        console.error(error)
        res.render('errors/500')
    }
})

// Insert new chat message in db
// POST /chat
// router.post('/', ensureAuth, async (req, res) => {
//     req.body.sender = req.user.id
//     req.body.chatMsg = req.body.chatMsg.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\\/g, '&#92;')
//     console.log(req.body)
//     // Store in db
    
//     // send response to client
//     res.sendStatus(200)
// })

module.exports = router