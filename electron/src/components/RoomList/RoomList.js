import React, { useState, useEffect } from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Room from '../Room/Room';

import io from 'socket.io-client';
import './RoomList.css';

const ENDPOINT = 'localhost:5000';

let socket;

const RoomList = () => {
  const [roomList, setroomList] = useState([{id: '', name:'', room:''}]);
  
  socket = io(ENDPOINT);
  
  useEffect(() => {
    console.log('123');
    socket.emit('getRoomList', () => {  
    });
  }, [ENDPOINT]);
  
  useEffect(() => {
    socket.on('sendRoom', ({users}) => {
      console.log('users', users);
      setroomList(users);
    });
  }, [roomList]);
  
  return(
    <div>
      
    </div>
  )
}

export default RoomList;