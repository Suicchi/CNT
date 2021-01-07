const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest } = require('../middleware/auth')


// Register
// /register
router.get('/', ensureAuth, (req,res)=>{
    res.render('dashboard')
})

router.get('/register', ensureGuest ,(req,res)=>{
    res.render('register')
})

// Login
// /login
router.get('/login', ensureGuest , (req,res)=>{
    res.render('login')
})

module.exports = router