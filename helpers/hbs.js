const moment = require('moment')

module.exports = {
	rmTags: (str) => {
		regex = /<[^>]*>/g
		let new_str = str.replace(regex, '')
		new_str = new_str.replace(/&nbsp;/g, '')
		return new_str
	},
	// Limits the input string to the given limit
	showOnly: (str, limit) => {
		if (str.length > 0 && str.length > limit) {
			let new_str = str + ' '
			new_str = str.substr(0, limit)
			new_str += '...'
			return new_str
		}
		return str
	},
	userIsAuthor: (author, currentUser) => {
		return author._id.toString() == currentUser._id.toString()
	},
	showDate: (date, format) => {
		return moment(date).format(format)
	},
	preSelect: (selected, options) => {
		return options
			.fn(this)
			.replace(
				new RegExp(`value="${selected}"`),
				`$& selected="selected"`
			)
	},
}
