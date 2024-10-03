const express = require('express');
const app = express();
const port = 4000;

const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { addUser } = require('./utils/users');
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('socket', socket.id);

    socket.on('join', (options, callback) => {
        const { username, room } = options;
        const { error, user } =addUser({ id: socket.id, })

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', `${user.room} 방에 오신 걸 환영합니다.`))
        socket.broadcast.to(user.room).emit('message', generateMessage('', `${user.username} 님이 방에 입장했습니다.`))
        
        io.to(user.room).emit('roodData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback();
    })
    socket.on('message', () => {})
    socket.on('disconnect', () => {})
})


const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 

