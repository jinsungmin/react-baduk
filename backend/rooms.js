const rooms = [];

const addRoom = ( {id, name, room }) => {
  // JavaScript Mastery = javascriptmastery
  
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const gameRoom = { id, name, room };

  rooms.push(gameRoom);

  return { gameRoom }
}

const removeRoom = (name) => {
  const index = rooms.findIndex((gameRoom) => gameRoom.name === name);
  console.log('index:', index);
  if(index !== -1) {
    return rooms.splice(index, 1)[0];
  }
}

const getRoom_name = (name) => {
  const index = rooms.findIndex((gameRoom) => gameRoom.name === name);
  if(index !== -1) {
    return rooms[index];
  }
}

const getRoom = (id) => rooms.find((room) => room.id === id);

//const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addRoom, removeRoom, getRoom, getRoom_name, rooms }