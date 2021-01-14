const moment = require('moment')

module.exports = {
	rmTags: (str) => {
		const regex = /<[^>]*>/g
		let newStr = str.replace(regex, '')
		newStr = newStr.replace(/&nbsp;/g, '')
		return newStr
	},
	// Limits the input string to the given limit
	showOnly: (str, limit) => {
		if (str.length > 0 && str.length > limit) {
			let newStr = `${str} `
			newStr = str.substr(0, limit)
			newStr += '...'
			return newStr
		}
		return str
	},
	userIsAuthor: (author, currentUser) =>
		author._id.toString() == currentUser._id.toString(),
	showDate: (date, format) => moment(date).format(format),
	preSelect: (selected, options) =>
		options
			.fn(this)
			// eslint-disable-next-line quotes
			.replace(new RegExp(`value="${selected}"`), `$& selected="selected"`),
	checkTask: (currentUser, sender, message) => {
		const regex = /(!task@)\w+/
		const testUser = `!task@${currentUser.username}`
		if (regex.test(message) && message.includes(testUser)) {
			const task = message.slice(testUser.length)
			return `<span class="">${sender.username}:</span> ${message}
				<form class="chatTodo" method="post" action="/todo/fromChat">
					<input type="hidden" name="task" class="task" value="From @${sender.username}: ${task}">
					<button type="submit">Add todo</button>
				</form>`
		}

		return `<span class="">${sender.username}:</span> ${message}`
	},
}
