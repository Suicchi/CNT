const express = require('express')

const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Note = require('../models/Note')
const User = require('../models/User')

// Show all notes
// GET /notes/public
router.get('/public', ensureAuth, async (req, res) => {
	try {
		const notes = await Note.find({ status: 'public' })
			.populate('author')
			.sort({ createdAt: 'desc' })
			.lean()

		res.render('notes/index', {
			type: 'Public',
			notes,
		})
	} catch (error) {
		console.error(error)
		res.render('errors/500')
	}
})

// Show all my notes
// GET /notes
router.get('/', ensureAuth, async (req, res) => {
	try {
		const notes = await Note.find({ author: req.user.id })
			.populate('author')
			.sort({ createdAt: 'desc' })
			.lean()

		res.render('notes/index', {
			type: '自分の',
			notes,
		})
	} catch (error) {
		console.error(error)
		res.render('errors/500')
	}
})

// Show users notes
// GET /notes/user/id
router.get('/user/:id', ensureAuth, async (req, res) => {
	try {
		if (req.user.id === req.params.id) {
			res.redirect('/notes')
		} else {
			const user = await User.findById(req.params.id)
			if (!user) {
				throw new Error('not found')
			} else {
				const { username } = user
				const notes = await Note.find({
					author: req.params.id,
					status: 'public',
				})
					.populate('author')
					.sort({ createdAt: 'desc' })
					.lean()

				res.render('notes/index', {
					username,
					notes,
				})
			}
		}
	} catch (error) {
		console.error(error)
		res.render('errors/500')
	}
})

// add note form
// GET /notes/add
router.get('/add', ensureAuth, (req, res) => {
	try {
		res.render('notes/add')
	} catch (error) {
		console.error(error)
		res.render('errors/500')
	}
})

// save note
// POST /notes/add
router.post('/add', ensureAuth, async (req, res) => {
	try {
		req.body.author = req.user.id
		await Note.create(req.body)
		res.redirect('/notes')
	} catch (error) {
		console.error(error)
		res.render('errors/500')
	}
})

// save note
// POST /notes/fromChat
router.post('/fromChat', ensureAuth, async (req, res) => {
	try {
		req.body.author = req.user.id
		await Note.create(req.body)
		res.redirect('/chat')
	} catch (error) {
		console.error(error)
		res.render('errors/500')
	}
})

// edit note
// GET /notes/edit/id
router.get('/edit/:id', ensureAuth, async (req, res) => {
	try {
		const note = await Note.findById(req.params.id).populate('author').lean()
		if (note) {
			if (note.author._id != req.user.id) {
				res.render('errors/500')
			} else {
				res.render('notes/edit', {
					note,
				})
			}
		} else {
			console.error("Couldn't find note")
			res.render('errors/404')
		}
	} catch (error) {
		console.error(error)
		res.render('errors/500')
	}
})

// Save edits
// PUT /notes/edit/id
router.put('/:id', ensureAuth, async (req, res) => {
	try {
		const note = await Note.findById(req.params.id)

		if (!note) {
			return res.render('error/404')
		}

		if (note.author != req.user.id) {
			throw new Error('Not allowed')
		} else {
			await Note.findOneAndUpdate({ _id: req.params.id }, req.body, {
				new: true,
				runValidators: true,
			})
			return res.redirect('/notes')
		}
	} catch (error) {
		console.error(error)
		return res.render('errors/500')
	}
})

// Read note
// GET /notes/id
router.get('/:id', ensureAuth, async (req, res) => {
	try {
		const note = await Note.findById(req.params.id).populate('author').lean()
		if (!note) {
			res.render('errors/404')
		} else if (note.author._id != req.user.id && note.status != 'public') {
			res.render('errors/500')
		} else {
			res.render('notes/view', {
				note,
			})
		}
	} catch (error) {
		console.error(error)
		res.render('errors/500')
	}
})

// Delete note
// DELTE /notes/
router.delete('/:id', ensureAuth, async (req, res) => {
	try {
		console.log(req.params.id)
		await Note.findOneAndDelete({ _id: req.params.id })
		console.log('Deleted')
		res.redirect('/notes')
	} catch (error) {
		console.error(error)
		res.render('/errors/500')
	}
})

module.exports = router
