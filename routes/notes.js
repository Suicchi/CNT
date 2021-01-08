const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')

const Note = require('../models/Note')
const User = require('../models/User')


// Show all notes
// GET /notes/public
router.get('/public', ensureAuth, async (req, res) =>{
    try {
        const notes = await Note.find({status: 'public'})
                                .populate('author')
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

//Show all my notes
// GET /notes
router.get('/', ensureAuth, async (req, res) =>{
    try {
        const notes = await Note.find({author: req.user.id})
                                .populate('author')
                                .sort({createdAt:'desc'})
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

// Show users notes
// GET /notes/user/id
router.get('/user/:id', ensureAuth, async (req, res) =>{
    try {

        if(req.user.id === req.params.id) {
            res.redirect('/notes')
        }
        else {
            const user = await User.findById(req.params.id)
            if(!user) {
                throw 'not found'
            } else {
                const username = user.username
                const notes = await Note.find({ author: req.params.id , status: 'public'})
                                    .populate('author')
                                    .sort({createdAt: 'desc'})
                                    .lean()
            
                res.render('notes/index', {
                    username: username,
                    notes
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.render('errors/500')
    }
})

// add note form
// GET /notes/add
router.get('/add', ensureAuth, (req, res) =>{
    try {
        res.render('notes/add')
    } catch (error) {
        console.log(error)
        res.render('errors/500')
    }
})


// save note
// POST /notes/add
router.post('/add', ensureAuth, async (req, res) =>{
    try {
        req.body.author = req.user.id
        await Note.create(req.body)
        console.log(req.body)
        res.redirect('/notes')
    } catch (error) {
        console.log(error)
        res.render('errors/500')
    }
})



module.exports = router