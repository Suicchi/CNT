const express = require('express')

const router = express()
const { ensureAuth } = require('../middleware/auth')
const Todo = require('../models/Todo')

// Create new todo
// POST /todo/
router.post('/', ensureAuth, async (req, res) => {
	try {
		req.body.author = req.user.id
		await Todo.create(req.body)
		return res.redirect('/')
	} catch (error) {
		console.error(error)
		return res.render('errors/500')
	}
})

// Create todo from chat
// POST /todo/fromChat
router.post('/fromChat', ensureAuth, async (req, res) => {
	try {
		req.body.author = req.user.id
		await Todo.create(req.body)
		// return res.json({ success: 'success' })
		return res.redirect('/chat')
	} catch (error) {
		console.error(error)
		return res.render('errors/500')
	}
})

// Delete the todo
// POST /todo/taskNo
router.delete('/:taskNo', ensureAuth, async (req, res) => {
	try {
		const taskNo = parseInt(req.params.taskNo, 10)
		const todo = await Todo.findOne({ taskNo })
		if (!todo) {
			console.error('No todo found')
			res.render('errors/500')
		} else if (todo.author != req.user.id) {
			console.error('bad user attempt')
			res.render('errors/500')
		} else {
			await Todo.deleteOne(todo)
			res.redirect('/')
		}
	} catch (error) {
		console.error(error)
		res.render('errors/500')
	}
})

module.exports = router
