import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import Cell from './Cell';
import axios from 'axios';

import './Game.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

const CELL_SIZE = 36;
const BOARD_SIZE = 19;
const boardWidth = CELL_SIZE * BOARD_SIZE;

let socket;

let grid = Array.apply(null, Array(BOARD_SIZE)).map((el, idx) => {
  return Array.apply(null, Array(BOARD_SIZE)).map((el, idx) => {
    return null;
  });
});

const Game = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const [turn, setTurn] = useState(0);
  //const [board, setBoard] = useState([]);
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    console.log(location.search);
    const { name, room } = queryString.parse(location.search);
    
    socket = io(ENDPOINT);

    //setTurn(0);
    setName(name);
    setRoom(room);

    resetGame();
    socket.emit('join', { name, room }, () => {
      
    });

    return () => {
      socket.emit('disconnect');

      socket.off();
    }
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      console.log('123');
      setMessages([...messages, message]);
    })
  }, [messages]);

  useEffect(() => {
    socket.on('turn', ({turn}) => {
      setTurn(turn);
    })
    getBoard();
    console.log('get turn:', turn);
  }, [turn]);
  
  // function for sending messages

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  const placeStone = (turn) => {
    console.log('111');
    socket.emit('placeStone', turn, () => {
    });
  }

  const resetGame = async () => {
    await axios.get('/data/reset').then((data) => {
      //setBoard(data.data.board);
      console.log('reset');
      placeStone(0);
    });
  }

  const getBoard = async() => {
    await axios.get('/data/board').then((data) => {    
      for(let i = 0; i< BOARD_SIZE; i++) {
        for(let j = 0; j < BOARD_SIZE; j++) {
          grid[i][j].setState({
            turn: data.data.board[i][j].turn,
            lived: data.data.board[i][j].lived,
          })
        }
      }
    })
  }

  const callBackServer = async (x, y) => {
    await axios.get('/data').then((data) => {
      //console.log("backserver data : ", data.data);
      //console.log('get turn:', data.data.board[x][y].turn);
      
      if(turn === data.data.board[x][y].turn) {
        alert('It is a place that cannot be place');
      }
      
      console.log('turn:', data.data.board[x][y].turn);
      //console.log('test DS:', data.data.deadStone.blackStone, data.data.deadStone.whiteStone);
        
      for(let i = 0; i< BOARD_SIZE; i++) {
        for(let j = 0; j < BOARD_SIZE; j++) {
          grid[i][j].setState({
            turn: data.data.board[i][j].turn,
            lived: data.data.board[i][j].lived,
          })
        }
      }
      //board = data.data.board;
      //console.log(board);
      placeStone(data.data.board[x][y].turn);
    });
    
  };

  const postClickedCellInfor =  async (x, y) => {
    console.log('post(turn,x,y): ',turn, x, y);
    await axios.post('/data', {
      data: {
        turn: turn,
        x: x,
        y: y,
      }
    })
    .then(function(response) {
      //console.log('callBack:',response);
    })
    .catch(function(error){
    });
    await callBackServer(x, y);
  }

  const renderBoard = () => {
    return Array.apply(null, Array(BOARD_SIZE)).map((el, rowIdx) => {     
      let cellList = Array.apply(null, Array(BOARD_SIZE)).map((el, colIdx) => {
        
        return <Cell
          postClickedCellInfor={postClickedCellInfor}
          key={colIdx}
          width={CELL_SIZE}
          height={CELL_SIZE}
          x={colIdx}
          y={rowIdx}
          ref={(ref) => { grid[colIdx][rowIdx] = ref}}
        />
      });
      
      return (
        <div 
        key={rowIdx} 
        style={{ 
          width: boardWidth, 
          height: CELL_SIZE, 
          display:'flex', 
          alignItems: 'flex-start' 
        }}>
          {cellList}
        </div>
      )
    });
  }

  //console.log(message, messages);
  return (  
    <div className="outerContainer">
      <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#EEEEEE',
      position: 'relative',
    }}>
      <div style={{ 
        width: boardWidth, 
        height: boardWidth, 
        backgroundColor: '#DDDDDD', 
        flexDirection: 'column',
        position: 'absolute',
        top: '50%',
        left: '30%',
        transform: 'translate(-50%, -50%)',
      }}>
      {renderBoard()}
      </div>
      <div style={{
        position: 'absolute',
        top: '2%',
        left: '40%',
      }}>
        <button 
          onClick={resetGame} 
          style={{
            width: 200, 
            height: 45, 
            border: '2px solid black',
            fontSize: 20,
            backgroundColor: 'white',
            color: 'red',
          }}
        >
          Reset
        </button>    
      </div>
      <div>
        {turn}
      </div>
    </div> 
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  )
}

export default Game;