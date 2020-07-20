const Rule = require('./Rule.js');
const resetBoard = require('./Reset.js');
const resetDeadStone = require('./ResetDeadStone.js');

const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json

const BOARD_SIZE = 19;

let board = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(null));
let deadStone = {
  blackStone: null,
  whiteStone: null,
};

let infor = {
  board: null,
  deadStone: null,
}

deadStone = resetDeadStone(deadStone);
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

app.post('/data', async (req, res) => { // data를 받을때 (클릭한 x,y 좌표) + 현재 turn
  console.log(req.body.data);

  board = await Rule(board, req.body.data, deadStone);

  await res.json(board);
  
})
 
app.listen(PORT,()=>{
    console.log(`server running on PORT ${PORT}`);
})