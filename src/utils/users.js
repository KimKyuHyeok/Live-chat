const users = [];

const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if(!username || !room) {
        return {
            error: '사용자 이름과 방이 필요합니다.'
        }
    }

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

module.exports = {
    addUser
}