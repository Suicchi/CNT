const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { route } = require('.')

// Register user
// /auth/reg
router.post('/reg', async (req, res)=>{
    try{
        if(req.body){
            if(req.body.password.length<8) {
                throw 'Password should be longer'
            }
            const salt = await bcrypt.genSalt(10)
            const encryptedPass = await bcrypt.hash(req.body.password, salt)
            const newUser = {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                salt: salt,
                password: encryptedPass
            }
            
            let user = await User.findOne({ username: req.body.username})
    
            if(user){
                // show error
                console.log('User already exists')
                req.flash('msg','User already exists')
                res.redirect('/register')
            }
            else {
                user = await User.create(newUser)
                req.flash('msg', 'Success')
                res.redirect('/login')
            }
        }
    } catch(err){
        console.error(err)
        req.flash('msg',err)
        res.redirect('/register')
    }
})

// Login user
// /auth/login
router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect:'/login',
    successRedirect:'/',    
}))

router.get('/logout', (req, res)=>{
    req.logout()
    res.redirect('/login')
})

// Testing flash messages - working!
// router.get('/test', (req,res)=>{
//     req.flash('msg', 'success')
//     res.redirect('/hi')
// })

module.exports = router