const users = [];

const addUser = ({id, username, room}) => {
    if(!username || !room) {
        return {
            error: '사용자 이름과 방이 필요합니다.'
        }
    }

    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    })

    if(existingUser) {
        return {
            error: '사용자 이름이 이미 존재합니다.'
        }
    }

    const user = { id, username, room };
    users.push(user);
    return { user };
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room);
}

const getUser = (id) => {
    return users.find((user) => user.id === id);
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

module.exports = {
    addUser,
    getUsersInRoom,
    getUser,
    removeUser
}