import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Game.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import Board from '../Board/Board';
import Temp from '../Temp/Temp';

let socket;

const Game = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const [turn, setTurn] = useState(0);
  const [board, setBoard] = useState('');
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    console.log(location.search);
    const { name, room } = queryString.parse(location.search);
    
    socket = io(ENDPOINT);
    
    setTurn(0);
    setName(name);
    setRoom(room);

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
    socket.on('turn', (turn) => {
      console.log('get turn:',turn.turn);
      setTurn(turn.turn);
    })
  }, [turn]);

  useEffect(() => {
    socket.on('board', (board) => {
      setBoard(board);
    })
  }, [board]);

  // function for sending messages

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  const placeStone = (turn) => {
    console.log('ccc', turn);
    if(turn) {
      socket.emit('placeStone', turn, () => setTurn(turn));
    }
  }

  //console.log(message, messages);

  return (  
    <div className="outerContainer">
      <Temp turn={turn} board={board} placeStone={placeStone} />
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      {turn}
    </div>
  )
}

export default Game;