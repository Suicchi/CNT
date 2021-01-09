const express = require('express')
// const socketConnection = require('../configs/sockets')
// express.set()
const router = express.Router()
const {ensureAuth } = require('../middleware/auth')


router.get('/', ensureAuth, (req, res)=>{

    res.render('chat')
})

module.exports = router