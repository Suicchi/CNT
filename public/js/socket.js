const clientSocket = io()

window.onload = scrollToLatestMessage()

// emit when joining
// clientSocket.emit('clientSystemMessage')

// set the username from server
clientSocket.on('setUsername', (username) => {
	document.getElementById('username').value = username
})

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

clientSocket.on('newMsg', (data) => {
	showMessage(data.username, data.chatMsg)
	// Scroll down to new message
	scrollToLatestMessage()
})

// DOM
document.getElementById('chatMsg').addEventListener('keypress', keypress)

function keypress(e) {
	if (e.key === 'Enter' || e.keyCode === 13) {
		sendMsg()
	}
}

function scrollToLatestMessage() {
	let messageHolder = document.getElementById('chat-messages')
	messageHolder.scrollTop = messageHolder.scrollHeight
}

function showMessage(username, message) {
	if (username == 'SYSTEM') {
		document.getElementById('chat-messages').innerHTML += `<div class="row">
            ${username}: ${message}
        </div>`
	} else {
		document.getElementById(
			'chat-messages'
		).innerHTML += `<div class="blue-grey card-panel lighten-5 left-align">
            <span class="">${username}:</span> ${message}
        </div>`
	}
}

// Messages from the server
clientSocket.on('systemMessage', (message) => {
	showMessage('SYSTEM', message)
})

// Update connected users
clientSocket.on('connectedUsers', (Users) => {
	const userholder = document.getElementById('user-holder')
	let myHtml = ''
	for (let user of Users) {
		myHtml += `<div><strong>${user}</strong></div>`
	}
	userholder.innerHTML = myHtml
})
