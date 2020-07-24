import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import blackStone from '../../assets/img/black-stone.png';
import whiteStone from '../../assets/img/white-stone.png';

import Cell from './Cell';
import axios from 'axios';

import './Game.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import CountDown from '../CountDown/CountDown';

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
  const [color, setColor] = useState(0);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [killWhiteStone, setKillWhiteStone] = useState(0);
  const [killBlackStone, setKillBlackStone] = useState(0);
  const [click, setClick] = useState(false);

  const [turn, setTurn] = useState(0);
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    console.log(location.search);
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    resetGame();

    socket.on('stoneColor', ({ color }) => {
      console.log('color:', color);
      setColor(color - 1);
    })

    socket.emit('join', { name, room }, () => {
    });

    return () => {
      socket.emit('disconnect');

      socket.off();
    }
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    })
  }, [messages]);

  useEffect(() => {
    socket.on('turn', ({ turn }) => {
      setTurn(turn);
    })
    console.log('get turn:', turn);
    if (room) {
      getBoard();
    }
  }, [turn]);

  // function for sending messages

  const getOutRoom = () => {
    socket.emit('disconnect');
  }

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  const placeStone = (turn) => {
    socket.emit('placeStone', turn, () => {
    });
  }
  // 상대방에게 승리 표시를 한 뒤 게임 리셋
  const loseGame = () => {
    socket.emit('loseGame');

    resetGame();
  }

  const resetGame = async () => {
    await axios.post('/data/reset', {
      data: {
        room: room,
      }
    }).then((data) => {
      console.log('reset complete');
      placeStone(0);
      //getBoard();
    });
  }
  // 착수 후 서버에서 받은 보드를 front에 적용하는 함수
  const getBoard = async () => {
    await axios.post('/data/board', {
      data: {
        room: room
      }
    }).then((data) => {
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          grid[i][j].setState({
            turn: data.data.board[i][j].turn,
            lived: data.data.board[i][j].lived,
          })
        }
      }
      setKillWhiteStone(data.data.deadStone.whiteStone);
      setKillBlackStone(data.data.deadStone.blackStone);
    })
  }

  const callBackServer = async (x, y) => {
    await axios.post('/data/modify', {
      data: {
        room: room
      }
    }).then((data) => {

      if (turn === data.data.board[x][y].turn) {
        alert('It is a place that cannot be place');
      }

      console.log('turn:', data.data.board[x][y].turn);

      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          grid[i][j].setState({
            turn: data.data.board[i][j].turn,
            lived: data.data.board[i][j].lived,
          })
        }
      }
      placeStone(data.data.board[x][y].turn);
    });
  };

  const postClickedCellInfor = async (x, y) => {
  
      if (turn % 2 === color) {
        console.log('post(turn,x,y): ', turn, x, y);
        await axios.post('/data', {
          data: {
            room: room,
            turn: turn,
            x: x,
            y: y,
          }
        })
          .then(function (response) {
            //console.log('callBack:',response);
          })
          .catch(function (error) {
          });
        await callBackServer(x, y);
      } else {
        alert('Not your Turn');
      }
    
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
          ref={(ref) => { grid[colIdx][rowIdx] = ref }}
        />
      });

      return (
        <div
          key={rowIdx}
          style={{
            width: boardWidth,
            height: CELL_SIZE,
            display: 'flex',
            alignItems: 'flex-start'
          }}>
          {cellList}
        </div>
      )
    });
  }

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
      </div>

      <div style={{
        position: 'absolute',
        top: '2%',
        left: '65%',
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
      <div style={{
        position: 'absolute',
        top: '90%',
        left: '65%',
      }}>
        <button
          onClick={loseGame}
          style={{
            width: 200,
            height: 45,
            border: '2px solid black',
            fontSize: 20,
            backgroundColor: 'white',
            color: 'red',
          }}
        >
          Give up
          </button>
      </div>

      {color}
      <div className="container">

        <InfoBar room={room} getOutRoom={getOutRoom}/>
        <div className="stone">
          <div className="blackStone">
            <img style={{ width: 50, height: 50, marginLeft: '10%' }} src={blackStone} />
            <div style={{ marginTop: 10, }}>
              {killBlackStone}<br />
              <CountDown turn={turn} color={0} />
            </div>

          </div>
          <div className="whiteStone">
            <div style={{ marginTop: 10, }}>
              {killWhiteStone}<br />
              <CountDown turn={turn} color={1} />
            </div>
            <img style={{ width: 50, height: 50, marginRight: '10%' }} src={whiteStone} />
          </div>
        </div>
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />

      </div>
    </div>
  )
}

export default Game;