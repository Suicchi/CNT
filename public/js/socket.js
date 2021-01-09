const clientSocket = io()

window.onload = scrollToLatestMessage()

// emit when joining
clientSocket.emit('clientSystemMessage', document.getElementById('username').value)

// Send message on button click
function sendMsg() {
    const chatMsg = document.getElementById('chatMsg');
    const username = document.getElementById('username');
    if(chatMsg.value !== '') {
        clientSocket.emit('chatMsg', {
            chatMsg : chatMsg.value,
            username : username.value
        })
        // we directly add it to the client 
        showMessage(username.value, chatMsg.value)
        scrollToLatestMessage()
        chatMsg.value = ''
        chatMsg.focus()
    }
    
}

clientSocket.on('newMsg', (data)=> {
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

function scrollToLatestMessage(){
    let messageHolder = document.getElementById('chat-messages')
    messageHolder.scrollTop = messageHolder.scrollHeight
}


function showMessage (username, message) {
    if(username == 'SYSTEM'){
        document.getElementById('chat-messages').innerHTML += 
        `<div class="row">
            ${username}: ${message}
        </div>`
    }
    else {
        document.getElementById('chat-messages').innerHTML += 
        `<div class="blue-grey card-panel lighten-5 left-align">
            <span class="">${username}:</span> ${message}
        </div>`
    }
}

// Messages from the server
clientSocket.on('systemMessage', message =>{
    showMessage('SYSTEM', message)
})