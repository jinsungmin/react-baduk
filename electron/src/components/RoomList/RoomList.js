import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import io from 'socket.io-client';

import ScrollToBottom from 'react-scroll-to-bottom';

import Room from '../Room/Room';

import './RoomList.css';

const ENDPOINT = 'localhost:5000';

let socket;

const RoomList = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [roomList, setroomList] = useState([{id: '', name:'', room:''}]);
  
  useEffect(() => {
    console.log(location.search);
    const name  = queryString.parse(location.search);
    
    setName(name);

    socket = io(ENDPOINT);
    
    socket.emit('login', name, () => {  
    });

    /*
    return () => {
      socket.emit('disconnect');

      socket.off();
    }
    */

  }, [ENDPOINT, location.search]);
  
  useEffect(() => {
    socket.on('sendRoom', ({users}) => {
      console.log('users', users);
      setroomList(users);
    });
  }, [roomList]);
  
  return(
    <div className="joinOuterContainer">
      <div className="existRoomContainer">
        <div className="roomListContainer">
          
        </div>
      </div>
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div><input placeholder="Room" className="joinInputRoom" type="text" onChange={(event) => setRoom(event.target.value)} /></div>
        <Link onClick={event => (!room || !name) ? event.preventDefault() : null} to={`/game?name=${name.name}&room=${room}`}>
          <button className="button" type="submit">Sign In</button>
        </Link>
      </div>
    </div>
  )
}

export default RoomList;