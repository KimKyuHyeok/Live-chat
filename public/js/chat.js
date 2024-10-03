const socket = io();

const query = new URLSearchParams(window.location.search);
const username = query.get('username');
const room = query.get('room');

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        window.location.href = '/';
    }
});

const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html;
})

const messages = document.querySelector('#messages');
const messageTemplate = document.querySelector('#message-template').innerHTML;

socket.on('message', (message) => {
    
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })

    messages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
})

const scrollToBottom = () => {
    messages.scrollTop = messages.scrollHeight;
}

const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('input');
const messageButton = document.querySelector('button');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    messageButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value;

    socket.emit('sendMessage', message, (error) => {
        messageButton.removeAttribute('disabled');
        messageInput.value = '';
        messageInput.focus();

        if (error) {
            return console.log(error);
        }
    })
})