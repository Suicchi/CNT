const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')
const bcrypt = require('bcrypt')

// Register user
// /auth/reg
router.post('/reg', async (req, res)=>{
    try{
        if(req.body){
            console.log(req.body)
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
            console.log(user)
    
            if(user){
                // show error
                console.log('User already exists')
                res.redirect('/')
            }
            else {
                user = await User.create(newUser)
                res.redirect('/login')
            }
        }
    } catch(err){
        console.error(err)
    }
})

// Login user
// /auth/login
router.post('/login', passport.authenticate('local', {
    failureRedirect:'/login',
    successRedirect:'/',
    failureFlash: true
}))


module.exports = router