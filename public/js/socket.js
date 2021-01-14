// eslint-disable-next-line no-undef
const clientSocket = io()

// Own function definitions

function scrollToLatestMessage() {
	const messageHolder = document.getElementById('chat-messages')
	messageHolder.scrollTop = messageHolder.scrollHeight
}

function showMessage(username, message) {
	if (username == 'SYSTEM') {
		document.querySelector('#chat-messages').innerHTML += `<div class="row">
            ${username}: ${message}
        </div>`
	} else {
		document.querySelector(
			'#chat-messages',
		).innerHTML += `<div class="blue-grey card-panel lighten-5 left-align">
            <span class="">${username}:</span> ${message}
        </div>`
	}
}

function showMessageWithAdd(username, message, task) {
	document.querySelector(
		'#chat-messages',
	).innerHTML += `<div class="blue-grey card-panel lighten-5 left-align">
			<span class="">${username}:</span> ${message}
			<form class="chatTodo" method="post" action="/todo/fromChat">
				<input type="hidden" name="task" class="task" value="From @${username}: ${task}">
				<button type="submit">Add todo</button>
			</form>
		</div>`
}

// Send the message to socket server
function sendMsg() {
	const chatMsg = document.querySelector('#chatMsg')
	const username = document.querySelector('#username')
	if (chatMsg.value !== '') {
		clientSocket.emit('chatMsg', {
			chatMsg: chatMsg.value,
		})
		// we directly add it to the client
		const regex = /(!task@)\w+/
		const testUsername = `!task@${username.value}`
		if (regex.test(chatMsg.value) && chatMsg.value.includes(testUsername)) {
			const task = chatMsg.value.slice(testUsername.length)
			showMessageWithAdd(username.value, chatMsg.value, task)
		} else {
			showMessage(username.value, chatMsg.value)
		}
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
	document.querySelector('#username').value = username
})

clientSocket.on('newMsg', (data) => {
	const regex = /(!task@)\w+/
	const myUsername = document.querySelector('#username').value
	const testUsername = `!task@${myUsername}`
	if (regex.test(data.chatMsg) && data.chatMsg.includes(testUsername)) {
		const task = data.chatMsg.slice(testUsername.length)
		showMessageWithAdd(data.username, data.chatMsg, task)
	} else {
		showMessage(data.username, data.chatMsg)
	}
	// Scroll down to new message
	scrollToLatestMessage()
})

document.querySelector('#chatMsg').addEventListener('keypress', keypress)

// Messages from the server
clientSocket.on('systemMessage', (message) => {
	showMessage('SYSTEM', message)
})

// Update connected users
clientSocket.on('connectedUsers', (Users) => {
	const userholder = document.querySelector('#user-holder')
	let myHtml = ''
	Users.forEach((user) => {
		console.log(user)
		myHtml += `<div><strong>${user}</strong></div>`
	})
	userholder.innerHTML = myHtml
})

// Jquery operations
/**
 * Todo:
 * use jquery and ajax to add the command to todo asynchronously
 */
$(document).ready(() => {
	// $('.chatTodo').on('submit', (e) => {
	// 	e.preventDefault()
	// 	// const task = $(this).find('input.task').val()
	// 	// console.log(task)
	// 	// $.ajax({
	// 	// 	type: 'POST',
	// 	// 	url: '/todo/fromChat',
	// 	// 	data: task,
	// 	// 	dataType: 'JSON',
	// 	// 	success(response) {
	// 	// 		console.log(response)
	// 	// 		// We can show a pop up that it's been saved
	// 	// 	},
	// 	// })
	// })
})
