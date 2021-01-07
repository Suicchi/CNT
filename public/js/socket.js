const socket = io()

socket.on('tx', data =>{
    console.log(data)
})