const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')

module.exports = function (passport) {
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email',
			},
			async (email, password, done) => {
				// console.log("hello")
				// User.findOne({email: email}, (err, user)=>{
				//     if(err) {
				//         return done(err)
				//     }
				//     if(!user) {
				//         return done(null, false);
				//     }
				//     if(!user.verifyPassword(password)){
				//         return done(null, false)
				//     }

				//     return done(null, user)
				// })

				// rewrote the same method asynchronously
				// if I want to use the method above then I have to remove the async from the beginning
				try {
					const user = await User.findOne({ email: email })

					if (!user) {
						return done(null, false)
					}
					if (!user.verifyPassword(password)) {
						return done(null, false)
					}

					return done(null, user)
				} catch (error) {
					console.error(error)
					return done(error)
				}
			}
		)
	)

	passport.serializeUser((user, done) => {
		done(null, user.id)
	})

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user)
		})
	})
}
