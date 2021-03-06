import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import blackStone from '../../assets/img/black-stone.png';
import whiteStone from '../../assets/img/white-stone.png';

import Cell from './Cell';
import axios from 'axios';

import Modal from '../SetGame/MyModal';

import './Game.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import CountDown from '../CountDown/CountDown';

const CELL_SIZE = 28;
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

  const [index, setIndex] = useState(0);
  const [start, setStart] = useState(-1);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [killWhiteStone, setKillWhiteStone] = useState(0);
  const [killBlackStone, setKillBlackStone] = useState(0);
  const [gameTime, setgameTime] = useState('');

  const [modal, setModal] = useState(false);
  const [time, setTime] = useState('10');
  const [color, setColor] = useState('auto');

  const [turn, setTurn] = useState(0);
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    console.log(location.search);
    const { name, room } = queryString.parse(location.search);
    console.log('name:',name);
    console.log('room', room);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    resetGame();

    socket.emit('join', { name, room }, () => {
    });
    /*
    return () => {
      //socket.emit('disconnect');
      socket.off();
    }
    */
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    })
  }, [messages]);

 
  useEffect(() => {
    socket.on('start', ({start}) => {
      setStart(start);  
    })
    console.log('start:', start);
    console.log('curTurn:', turn);
    console.log('curIndex:', index);
  }, [start]);

  useEffect(() => {
    socket.on('turn', ({ turn }) => {
      setTurn(turn);
    })
    console.log('get turn:', turn);
    if (room) {
      getBoard();
    }
  }, [turn]);

  useEffect(() => {
    socket.on('index', ({index}) => {
      setIndex(index);
    })
  }, [index]);

  useEffect(() => {
    socket.on('modal', () => {
      setModal(true);
    })
  }, [modal]);

  useEffect(() => {
    socket.on('modal_time', ({time}) => {
      setTime(time);
    })
    console.log('time:',time);
  }, [time]);

  useEffect(() => {
    socket.on('modal_color', ({color}) => {
      setColor(color);
    })
  }, [color]);

  useEffect(() => {
    socket.on('gameTime', ({time}) => {
      setgameTime(time);
    })
    console.log('gameTime:', gameTime);
  }, [gameTime]);

  // function for sending messages
  
  const getOutRoom = (name) => {
    socket.emit('back', name, () => {
    });
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

  const checkGameSet = (time, color) => {
    console.log('gameSet:', time ,color);
    if(index === 0) {
      socket.emit('sendGameSet', {time, color}, () => {
      });
    } else {
      socket.emit('gameSet', {time, color}, () => {
      });
    }
  }

  const judgeWinner = (black, white) => {
    socket.emit('judgeWinner', {black, white}, () => {
      
    })
  }

  // 상대방에게 승리 표시
  const loseGame = () => {
    socket.emit('loseGame');
  }

  const handleCloseModal = () => {
    setModal(false);
  };

  const onSearchSubmit = (time, color) => {
    console.log("please:", time, color);
    checkGameSet(time, color);
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
      console.log('check:', turn, index, start);
      if (turn % 2 === index && start === 1) {
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

  const judgeGame = async () => {
    await axios.post('/data/judge', {
      data: {
        room: room,
      }
    }).then((data) => {
      console.log('judge complete');
      console.log('blackCount:', data.data[0]);
      console.log('whiteCount:', data.data[1]);
      judgeWinner(data.data[0], data.data[1]);
    });
  }

  const presentJudgeGame = async () => {
    await axios.post('/data/judge', {
      data: {
        room: room,
      }
    }).then((data) => {
      console.log('judge complete');
      console.log('blackCount:', data.data[0]);
      console.log('whiteCount:', data.data[1]);
    });
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
          top: '47%',
          left: '40%',
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
            width: 100,
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
        top: '92%',
        left: '67%',
      }}>
        <button
          onClick={loseGame}
          style={{
            width: 80,
            height: 30,
            border: '1px solid black',
            fontSize: 10,
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          Give up
          </button>
      </div>

      <div style={{
        position: 'absolute',
        top: '92%',
        left: '57%',
      }}>
        <button
          onClick={judgeGame}
          style={{
            width: 80,
            height: 30,
            border: '1px solid black',
            fontSize: 10,
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          계가 신청
          </button>
      </div>
      <div style={{
        position: 'absolute',
        top: '92%',
        left: '47%',
      }}>
        <button
          onClick={presentJudgeGame}
          style={{
            width: 80,
            height: 30,
            border: '1px solid black',
            fontSize: 10,
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          형세 판단
          </button>
      </div>

      
      <div className="container">
        {
        modal && <Modal
          onClose={handleCloseModal} onSubmit={onSearchSubmit} time={time} color={color}/>
        }
        <InfoBar name={name} room={room} getOutRoom={getOutRoom}/>
        <div className="stone">
          <div className="blackStone" style={{marginTop: '3%' }}>
            <img style={{ width: 30, height: 30, marginLeft: '10%'}} src={blackStone} />   
            <div style={{fontSize: '1.1em', fontWeight: 'bold'}} >
              {killBlackStone}<br/>
              <CountDown turn={turn} color={0} start={start} gameTime = {gameTime}/>
            </div>
            
          </div>

          <div className="whiteStone" style={{marginTop: '3%' }}>
            <div style={{ fontSize: '1.1em', fontWeight: 'bold' }}>
              {killWhiteStone}<br/>
              <CountDown turn={turn} color={1} start={start} gameTime = {gameTime}/>
            </div>
            <img style={{ width: 30, height: 30, marginRight: '10%', marginTop: '3%' }} src={whiteStone} />
          </div>
        </div>
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />

      </div>
    </div>
  )
}

export default Game;