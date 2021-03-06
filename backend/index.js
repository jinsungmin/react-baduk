const Rule = require('./Rule.js');
const resetBoard = require('./Reset.js');
const Judge = require('./judge.js');
const resetDeadStone = require('./ResetDeadStone.js');

const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const bodyParser = require('body-parser');

const { addUser, removeUser, getUser, users } = require('./users.js');
const { addRoom, removeRoom, getRoom, getIndex, removeUserInRoom, rooms } = require('./rooms.js');

const PORT = process.env.PORT || 5000

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const BOARD_SIZE = 19;

let serverBoards = [];

var Data = function(roomName, board, deadStone) {
  this.roomName = roomName;
  this.board = board;
  this.deadStone = deadStone;
}

let deadStone = {
  blackStone: 0,
  whiteStone: 0,
};

let board = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(null));

io.on('connection', (socket) => {
  
  socket.on('login', ({name}, callback) => {
    console.log('login-user:', name);
    let exist = 0;
    for(let i = 0; i< users.length; i++) {
      if(name === users[i].name) {
        exist++;
      }
    }
    if(exist === 0) {
      const {error, user } = addUser({id: socket.id, name});
      console.log('We have a new connection.');
      if(error) return callback(error);
    } else {
      const {error, user } = addUser({id: socket.id, name});
      if(error) return callback(error);
    }
    console.log('users:',users);
    console.log('total user count:', users.length);
    socket.emit('sendRoom', {rooms: rooms}); 
  })

  socket.on('join', ({name, room}, callback) => {
    const { error, gameRoom } = addRoom({id: socket.id, name, room });
    
    const index = getIndex(socket.id);

    io.to(gameRoom.id[index]).emit('index', { index: index});

    if(index === 1) {
      //for(let i = 0; i<= index; i++) {
      //  io.to(gameRoom.id[i]).emit('start', { start: index});
      //}
      io.to(gameRoom.id[0]).emit('modal');
    }

    console.log('roomList:', rooms);

    if(error) return callback(error);
    
    let count = 0;

    for(let i = 0; i < rooms.length; i++) {
      if(gameRoom.room === rooms[i].room) {
        count++;
      }
    }

    if(index === 0) {
      let tempBoard = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(null));
      tempBoard= resetBoard(tempBoard);
      deadStone = resetDeadStone(deadStone);

      serverBoards.push(new Data(gameRoom.room, tempBoard, deadStone));
    }
    
    console.log('serverBoardsLength:',serverBoards.length);

    socket.emit('message', { user: 'admin', text: `${gameRoom.name[index]}, welcome to the room ${gameRoom.room}` });
    socket.broadcast.to(gameRoom.room).emit('message', { user: 'admin', text: `${gameRoom.name[index]}, has joined!`});
    
    socket.join(gameRoom.room);

    io.emit('sendRoom', {rooms: rooms});
    
    callback();
  });

  socket.on('getRoomList', () => {
    console.log('users:',users);
    if(users.length !== 0)
      socket.emit('sendRoom', {users: users});
    /*
    for(let i = 0; i< users.length; i++) {
      io.to(user.room).emit('message', { user: user.name, text: message});
    }
    */
  })

  // socket.id이 속한 room의 index 1에 전달 

  socket.on('sendGameSet', ({time, color}, callback) => {
    const gameRoom = getRoom(socket.id);

    io.to(gameRoom.id[1]).emit('modal');
    io.to(gameRoom.id[1]).emit('modal_time', {time: time});
    io.to(gameRoom.id[1]).emit('modal_color',{color: color});

    callback();
  });

  socket.on('gameSet', ({time, color}, callback) => {
    const gameRoom = getRoom(socket.id);
    
    if(color === 'black') {
      io.to(gameRoom.id[0]).emit('index',{index: 1});
      io.to(gameRoom.id[1]).emit('index',{index: 0});
    } else {
      io.to(gameRoom.id[0]).emit('index',{index: 0});
      io.to(gameRoom.id[1]).emit('index',{index: 1});
    }
    for(let i = 0; i< 2; i++) {
      io.to(gameRoom.id[i]).emit('gameTime',{time: time});
      io.to(gameRoom.id[i]).emit('start', { start: 1});
    }
    callback();

  });

  socket.on('sendMessage', (message, callback) => {
    const gameRoom = getRoom(socket.id);

    io.to(gameRoom.room).emit('message', { user: gameRoom.name, text: message});

    callback();
  });

  socket.on('placeStone', (turn, callback) => {
    const gameRoom = getRoom(socket.id);
    
    io.to(gameRoom.room).emit('turn', { turn: turn});
  
    callback();
  });
  
  socket.on('loseGame', () => {
    const gameRoom = getRoom(socket.id);

    io.to(gameRoom.room).emit('message', { text: `${gameRoom.name} Lose!`});
    
  });

  socket.on('judgeWinner', ({black, white}, callback) => {
    const gameRoom = getRoom(socket.id);
    io.to(gameRoom.room).emit('message', { text: `Black: ${black} White: ${white}`});
    if(black > white) {
      io.to(gameRoom.room).emit('message', { text: `Black is Win!!`});
    } else {
      io.to(gameRoom.room).emit('message', { text: `White is Win!!`});
    }

    callback();
  });
  
  // 착수 후 보드 처리 socket 추가

  socket.on('disconnect', () => {
    console.log('disconnected!');
    let gameRoom;
    const user = removeUser(socket.id);
    if(user !== -1) {
      gameRoom = removeUserInRoom(user.name);
    } else {
      gameRoom = -1;
    }
    if(gameRoom !== -1) {
      if(gameRoom.id.length === 0) { // 방에서 나갈때 유저의 수가 한명이면 그 방에 대응하는 보드를 삭제
        removeRoom(gameRoom.room);
        const findItem = serverBoards.find(function(item) {
          return item.roomName === gameRoom.room;
        })
        const idx = serverBoards.indexOf(findItem);
        serverBoards.splice(idx, 1);
      }
      
      if(gameRoom.id.length) {
        io.to(gameRoom.room).emit('message', { user: 'admin', text: `${gameRoom.name} has left.`});
        io.to(gameRoom.room).emit('message', { user: 'admin', text: 'You Win!!'});
      }
        
      console.log('User had left.');
      console.log('serverBoardsLength:',serverBoards.length);
    }
    io.emit('sendRoom', {rooms: rooms});
  })

  socket.on('back', (name, callback) => {
    
    let ok = null;
    for(let i = 0; i< users.length; i++) {
      if(name === users[i].name) {
        ok = users[i].name;
      }
    }
    
    let gameRoom = removeUserInRoom(ok);
    
    if(gameRoom.id.length === 0) { // 방에서 나갈때 유저의 수가 한명이면 그 방에 대응하는 보드를 삭제
      removeRoom(gameRoom.room);
      const findItem = serverBoards.find(function(item) {
        return item.roomName === gameRoom.room;
      })
      const idx = serverBoards.indexOf(findItem);
      serverBoards.splice(idx, 1);
    }
    
    if(gameRoom.id.length) {
      io.to(gameRoom.room).emit('message', { user: 'admin', text: `${gameRoom.name} has left.`});
      io.to(gameRoom.room).emit('message', { user: 'admin', text: 'You Win!!'});
    }
      
    console.log('User had left.');
    console.log('serverBoardsLength:',serverBoards.length);
    io.emit('sendRoom', {rooms: rooms});

    callback();
  });
  
});

app.use(cors());
app.use(router);

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json

let infor = {
  board: null,
  deadStone: null,
}

app.post('/data/modify', async (req,res)=>{
  for(let i = 0; i < serverBoards.length; i++) {
    if(req.body.data.room === serverBoards[i].roomName) {
      infor.board = await serverBoards[i].board;
      infor.deadStone = await serverBoards[i].deadStone; 
      
      break;
    }
  }

  res.json(infor);  
})

app.post('/data/reset',async (req,res)=>{
  
  for(let i = 0; i < serverBoards.length; i++) {
    if(req.body.data.room === serverBoards[i].roomName) {
      serverBoards[i].board = await resetBoard(serverBoards[i].board);
      serverBoards[i].deadStone = await resetDeadStone(serverBoards[i].deadStone); 

      infor.board = serverBoards[i].board;
      infor.deadStone = serverBoards[i].deadStone;
      break;
    }
  }

  res.json(infor);
})

app.post('/data/board', async (req, res) => {
  for(let i = 0; i < serverBoards.length; i++) {
    if(req.body.data.room === serverBoards[i].roomName) {
      infor.board = serverBoards[i].board;
      infor.deadStone = serverBoards[i].deadStone;
      break;
    }
  }

  res.json(infor);
})

app.post('/data/judge', async (req, res) => {
  let result = [];
  for(let i = 0; i < serverBoards.length; i++) {
    if(req.body.data.room === serverBoards[i].roomName) {
      result = await Judge(serverBoards[i].board, serverBoards[i].deadStone);
      break;
    }
  }
  console.log('post:', result);
  res.json(result);
})

app.post('/data', async (req, res) => { // data를 받을때 (클릭한 x,y 좌표) + 현재 turn
  console.log(req.body.data);
  
  for(let i = 0; i < serverBoards.length; i++) {
    if(req.body.data.room === serverBoards[i].roomName) {
      console.log('deadStone:',serverBoards[i].deadStone);
      serverBoards[i].board = await Rule(serverBoards[i].board, req.body.data, serverBoards[i].deadStone);
      await res.json(board);

      break;
    }
  }
})

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
