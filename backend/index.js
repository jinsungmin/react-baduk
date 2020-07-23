const Rule = require('./Rule.js');
const resetBoard = require('./Reset.js');
const resetDeadStone = require('./ResetDeadStone.js');

const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const bodyParser = require('body-parser');

const { addUser, removeUser, getUser, getUsersInRoom, users } = require('./users.js');

const PORT = process.env.PORT || 5000

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let count = 0;
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
  console.log('We have a new connection.');

  socket.on('join', ({name, room}, callback) => {
    const { error, user } = addUser({id: socket.id, name, room });

    if(error) return callback(error);
    
    for(let i = 0; i < users.length; i++) {
      if(user.room === users[i].room) {
        count++;
      }
    }

    if(count === 1) {
      let tempBoard = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(null));
      tempBoard= resetBoard(tempBoard);
      deadStone = resetDeadStone(deadStone);
      console.log('11111111',deadStone);
      serverBoards.push(new Data(user.room, tempBoard, deadStone));
    }
    
    console.log('total user count:', users.length);
    
    console.log('serverBoardsLength:',serverBoards.length);

    socket.emit('stoneColor', {color: count});
    count = 0;
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!`});
    
    socket.join(user.room);

    io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});
    
    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message});
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});

    callback();
  });

  socket.on('placeStone', (turn, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('turn', { turn: turn});
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});

    callback();
  });

  // 착수 후 보드 처리 socket 추가

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.`});
    }
    console.log('User had left.');
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

//board = resetBoard(board);

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
