// eslint-disable-next-line no-undef
const clientSocket = io()

// Own function definitions

function scrollToLatestMessage() {
	const messageHolder = document.getElementById('chat-messages')
	messageHolder.scrollTop = messageHolder.scrollHeight
}

function showMessage(username, message) {
	if (username == 'SYSTEM') {
		document.getElementById('chat-messages').innerHTML += `<div class="row">
            ${username}: ${message}
        </div>`
	} else {
		document.getElementById(
			'chat-messages',
		).innerHTML += `<div class="blue-grey card-panel lighten-5 left-align">
            <span class="">${username}:</span> ${message}
        </div>`
	}
}

// Send the message to socket server
function sendMsg() {
	const chatMsg = document.getElementById('chatMsg')
	const username = document.getElementById('username')
	if (chatMsg.value !== '') {
		clientSocket.emit('chatMsg', {
			chatMsg: chatMsg.value,
		})
		// we directly add it to the client
		showMessage(username.value, chatMsg.value)
		scrollToLatestMessage()
		chatMsg.value = ''
		chatMsg.focus()
	}
}

function keypress(e) {
	if (e.key === 'Enter' || e.keyCode === 13) {
		sendMsg()
	}
}

// Function definition ends

// eslint-disable-next-line no-undef
window.onload = scrollToLatestMessage()

// Client Socket Operations
// set the username from server
clientSocket.on('setUsername', (username) => {
	document.getElementById('username').value = username
})

clientSocket.on('newMsg', (data) => {
	showMessage(data.username, data.chatMsg)
	// Scroll down to new message
	scrollToLatestMessage()
})

document.getElementById('chatMsg').addEventListener('keypress', keypress)

// Messages from the server
clientSocket.on('systemMessage', (message) => {
	showMessage('SYSTEM', message)
})

// Update connected users
clientSocket.on('connectedUsers', (Users) => {
	const userholder = document.getElementById('user-holder')
	let myHtml = ''
	Users.forEach((user) => {
		console.log(user)
		myHtml += `<div><strong>${user}</strong></div>`
	})
	userholder.innerHTML = myHtml
})
