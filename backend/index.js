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

io.on('connection', (socket) => {
  console.log('We have a new connection.');

  socket.on('join', ({name, room}, callback) => {
    const { error, user } = addUser({id: socket.id, name, room });

    if(error) return callback(error);

    console.log('total user count:', users.length);
    for(let i = 0; i < users.length; i++) {
      if(user.room === users[i].room) {
        count++;
      }
    }
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

const BOARD_SIZE = 19;

let board = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(null));

let deadStone = {
  blackStone: 0,
  whiteStone: 0,
};

let infor = {
  board: null,
  deadStone: null,
}

board = resetBoard(board);

app.get('/data',(req,res)=>{
  infor.board = board;
  infor.deadStone = deadStone;

  res.json(infor);  
})

app.get('/data/reset',async (req,res)=>{
  board = await resetBoard(board);
  deadStone = await resetDeadStone(deadStone);
  
  infor.board = board;
  infor.deadStone = deadStone;

  res.json(infor);
})

app.get('/data/board', async (req, res) => {
  infor.board = board;
  infor.deadStone = deadStone;

  res.json(infor);
})

app.post('/data', async (req, res) => { // data를 받을때 (클릭한 x,y 좌표) + 현재 turn
  console.log(req.body.data);

  board = await Rule(board, req.body.data, deadStone);

  await res.json(board);
})

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
