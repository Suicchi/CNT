const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest } = require('../middleware/auth')


// Register
// /register
router.get('/', ensureAuth, (req,res)=>{
    res.render('dashboard')
})

router.get('/register', ensureGuest ,(req,res)=>{
    res.render('register', {layout: 'logreg', msg: req.flash('msg')})
})

// Login
// /login
router.get('/login', ensureGuest , (req,res)=>{
    // console.log(req.flash('msg'))
    res.render('login', {layout:'logreg', msg: req.flash('msg')})
    // res.send(req.flash('msg'))
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