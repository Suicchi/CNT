const clientSocket = io()

// emit when joining

// Send message on button click
function sendMsg() {
    const chatMsg = document.getElementById('chatMsg');
    const username = document.getElementById('username');
    if(chatMsg.value !== '') {
        clientSocket.emit('chatMsg', {
            chatMsg : chatMsg.value,
            username : username.value
        })
    }
    chatMsg.value = ''
}

clientSocket.on('newMsg', (data)=> {
    document.getElementById('chat-messages').innerHTML += 
    `<div class="row">
        <div class="col s2">
            <span>${data.username}:</span>
        </div>
        <div class="col s8">
            ${data.chatMsg}
        </div>
    </div>`
})