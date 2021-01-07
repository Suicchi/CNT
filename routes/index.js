const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest } = require('../middleware/auth')


// Dashboard
// GET /
router.get('/', ensureAuth, (req,res)=>{
    res.render('dashboard', {
        name : req.user.name,
        id: req.user._id
    })
})

// Register
// GET /register
router.get('/register', ensureGuest ,(req,res)=>{
    res.render('register', {layout: 'logreg', msg: req.flash('msg')})
})

// Login
// GET /login
router.get('/login', ensureGuest , (req,res)=>{
    res.render('login', {layout:'logreg', msg: req.flash('msg')})
})

// Testing flash messages - working
// router.get('/test', (req,res)=>{
//     req.flash('msg', 'success')
//     res.redirect('/hi')
// })

// router.get('/hi', (req, res)=>{
//     res.send(req.flash('msg'))
// })

module.exports = router