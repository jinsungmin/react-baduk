const rooms = [];

const addRoom = ( {id, name, room }) => {
  // JavaScript Mastery = javascriptmastery
  
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  for(let i = 0; i < rooms.length; i++) {
    if(room === rooms[i].room) {
      rooms[i].name.push(name);
      rooms[i].id.push(id);

      const gameRoom = rooms[i];

      return { gameRoom }
    }
  }

  const gameRoom = { id:[id], name:[name], room };

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

//const getRoom = (id) => rooms.find((room) => room.id === id);

const getRoom = (id) => {
  for(let i = 0; i< rooms.length; i++) {
    for(let j = 0; j < rooms[i].id.length; j++) {
      if(id === rooms[i].id[j])
        return rooms[i];
    }
  }
}

const getIndex = (id) => {
  for(let i = 0; i< rooms.length; i++) {
    for(let j = 0; j < rooms[i].id.length; j++) {
      if(id === rooms[i].id[j])
        return j;
    }
  }
}

//const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addRoom, removeRoom, getRoom, getRoom_name, getIndex,rooms }