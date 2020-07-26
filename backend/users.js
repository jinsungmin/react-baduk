const users = [];

const addUser = ( {id, name}) => {
  // JavaScript Mastery = javascriptmastery  
  room = null;

  const existingUser = users.find((user) => user.name === name);

  if(existingUser) {
    const idx = users.findIndex((user) => user.name === name);
    users[idx].id = id;
    return { existingUser };
  }

  const user = { id, name, room };

  users.push(user);

  return { user }
}

const removeUser = (id) => {
  index = users.findIndex((user) => user.id === id);

  if(index !== -1) {
    return users.splice(index, 1)[0];
  }
}

const getUser = (id) => users.find((user) => user.id === id);


const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom, users }