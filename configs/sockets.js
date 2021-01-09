// importing required models
const Chat = require('../models/Chat')
const User = require('../models/User')

module.exports = (io) => {
	// For now it's holding the users that are connected to the room
	// Will be changed to be grabbed from database collections
	const connectedUsers = []
	const socketDict = {}

	io.on('connection', async (socket) => {
		const userId = socket.request.session.passport.user
		if (!userId) {
			// Get out impostor!
			socket.disconnect()
		}
		/**
		 * For now I'm just using an array of objects to store
		 * the username and socketid
		 * Todo:
		 * Create rooms model
		 * Store the user in room if not exists
		 */

		//  get the username
		const user = await User.findById(userId).select('username').lean()
		console.log(
			`${user.username} with socketid: ${socket.id} has connected`
		)
		// Store in array
		if (!connectedUsers.includes(user.username)) {
			connectedUsers.push(user.username)
			socketDict[user.username] = [socket.id]
		} else {
			socketDict[user.username].push(socket.id)
		}

		// console.log(connectedUsers)
		// console.log(socketDict[user.username])

		// Emit to all the connected users about who is in room
		io.emit('connectedUsers', connectedUsers)

		socket.emit('setUsername', user.username)

		// On receiption of chat message
		socket.on('chatMsg', async (data) => {
			// neutralize the message
			// then put to db
			const msg = data.chatMsg
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/\\/g, '&#92;')

			const newChatMSG = {
				chatMsg: msg,
				sender: userId,
			}

			await Chat.create(newChatMSG)
			// console.log('msg stored')
			// Let all connected parties know about new message
			socket.broadcast.emit('newMsg', {
				chatMsg: msg,
				username: user.username,
			})
		})

		// On disconnection
		socket.on('disconnect', () => {
			console.log(`${user.username} with ${socket.id} disconnected`)
			socketDict[user.username].splice(
				socketDict[user.username].indexOf(socket.id),
				1
			)
			if (socketDict[user.username].length === 0) {
				connectedUsers.splice(connectedUsers.indexOf(user.username), 1)
			}
			// console.log(connectedUsers)
			io.emit('connectedUsers', connectedUsers)
		})
	})
}
