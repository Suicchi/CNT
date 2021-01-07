const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')

const Note = require('../models/Note')


// Show all notes
// GET /
router.get('/', ensureAuth, async (req, res) =>{
    try {
        const notes = await Note.find({status: 'public'})
                                .populate('user')
                                .sort({createdAt:'desc'})
                                .lean()
        
        res.render('notes/index', {
            type: 'Public',
            notes
        })
    } catch (error) {
        console.log(error)
        res.render('errors/500')
    }
})

// Show only users notes
// GET /id
router.get('/:id', ensureAuth, async (req, res) =>{
    try {
        const notes = await Note.find({author: req.params.id})
                                .populate('user')
                                .sort({createdAt: 'desc'})
                                .lean()
        
        res.render('notes/index', {
            type: 'My',
            notes
        })
    } catch (error) {
        console.log(error)
        res.render('errors/500')
    }
})


module.exports = router