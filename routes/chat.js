const express = require('express')

const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Chat = require('../models/Chat')

// render the public chat view
// GET /chat
router.get('/', ensureAuth, async (req, res) => {
	try {
		const chats = await Chat.find().populate('sender').lean()
		res.render('chat', {
			chats,
			username: req.user.username,
		})
	} catch (error) {
		console.error(error)
		res.render('errors/500')
	}
})

module.exports = router
