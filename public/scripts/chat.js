const socket = io('/');

const username = localStorage.getItem("username") || 'Hacker';
const room = window.location.href.split("/").pop();

const messageInput = document.getElementById('message');
const messagesContainer = document.getElementById('messages');

socket.emit('joinRoom', { room, username });

document.getElementById('trigger').addEventListener('click', () => {
    const msg = messageInput.value; 
    const timestamp = new Date().toLocaleString();

    console.log('Va a enviar el texto: ', msg);

    socket.emit('sendNewMessage', {
        message: msg, 
        room: room,
        sender: username,
        timestamp: timestamp
    });

    const messageElement = document.createElement('div');
    messageElement.textContent = `Tú [${timestamp}]: ${msg}`;
    messageElement.classList.add("yourBubble");
    messagesContainer.appendChild(messageElement);
    messageInput.value = ''; 
});

socket.on('messageReceived', (data) => {
    console.log("Otro usuario mandó el mensaje: ", data);
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.sender} [${data.timestamp}]: ${data.message}`;
    messageElement.classList.add("otherBubble");
    messagesContainer.appendChild(messageElement);
});

socket.on('userJoined', (message) => {
    const joinMessageElement = document.createElement('div');
    joinMessageElement.textContent = message;
    joinMessageElement.classList.add("joinMessage");
    messagesContainer.appendChild(joinMessageElement);
});
