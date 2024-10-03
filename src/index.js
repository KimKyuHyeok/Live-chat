const express = require('express');
const app = express();
const port = 4000;

const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { addUser, getUsersInRoom, getUser, removeUser } = require('./utils/users');
const { generateMessage } = require('./utils/messages');
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('socket', socket.id);

    socket.on('join', (options, callback) => {
        const { username, room } = options;
        const { error, user } = addUser({ id: socket.id, username, room})

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', `${user.room} 방에 오신 걸 환영합니다.`))
        socket.broadcast.to(user.room).emit('message', generateMessage('', `${user.username} 님이 방에 입장했습니다.`))
        
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

    })
    socket.on('sendMessage', (message, callback) => {

        const user = getUser(socket.id);

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback();
    })
    socket.on('disconnect', () => {
        console.log('socket disconnected', socket.id);
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} 님이 방에서 나갔습니다.`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})


const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 

