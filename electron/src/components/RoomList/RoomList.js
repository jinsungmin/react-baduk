import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import io from 'socket.io-client';

import userIcon from '../../assets/img/user-icon.png';
import roomIcon from '../../assets/img/room-icon.png';

import ScrollToBottom from 'react-scroll-to-bottom';

import './RoomList.css';

const ENDPOINT = 'localhost:5000';

let socket;

const RoomList = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [roomList, setroomList] = useState([{id: '', name: [{name: ''}], room:''}]);
  
  useEffect(() => {
    console.log(location.search);
    const name  = queryString.parse(location.search);
    
    setName(name);

    socket = io(ENDPOINT);
    
    socket.emit('login', name, () => {
    });

    return () => {
      socket.emit('disconnect');

      socket.off();
    }
    
  }, [ENDPOINT, location.search]);
  
  useEffect(() => {
    socket.on('sendRoom', ({rooms}) => {
      setroomList(rooms);
    });
    console.log('roomList:', roomList);
    
  }, [roomList]);
  
  return(
    <div className="joinOuterContainer">
      <div className="existRoomContainer">
          {roomList.map((i) => 
            <div className="roomContainer">
              <img style={{ width: 22, height: 22, marginLeft: '3%', marginRight: '1%', marginTop: '2%' }} src={roomIcon} /> {i.room}
              <br/><img style={{ width: 22, height: 22, marginRight: '1%', marginTop: '2%' }} src={userIcon} /> {i.name.map((x) => x + ' ')} 
            </div>
          )}
      </div>
     
      <div className="joinInnerContainer">
        <h1 className="heading">Room Number</h1>
        <div><input placeholder="Room" className="joinInputRoom" type="text" onChange={(event) => setRoom(event.target.value)} /></div>
        <Link onClick={event => (!room || !name) ? event.preventDefault() : null} to={`/game?name=${name.name}&room=${room}`}>
          <button className="button" type="submit">Enter</button>
        </Link>
      </div>
    </div>
  )
}

export default RoomList;