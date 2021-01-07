const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email,password, done)=>{
        // console.log("hello")
        User.findOne({email: email}, (err, user)=>{
            if(err) {
                return done(err)
            }
            if(!user) {
                return done(null, false);
            }
            if(!user.verifyPassword(password)){
                return done(null, false)
            }
            
            return done(null, user)
        })
    }))

    passport.serializeUser((user,done)=>{
        done(null, user.id)
    })

    passport.deserializeUser((id,done)=> {
        User.findById(id, (err, user)=>{
            done(err, user)
        })
    })

}
