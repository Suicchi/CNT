function ensureGuest(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/')
	}
	return next()
}

function ensureAuth(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	return res.redirect('/login')
}

module.exports = {
	ensureAuth,
	ensureGuest,
}
