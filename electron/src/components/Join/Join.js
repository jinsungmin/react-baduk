import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Join.css';

const Join = () => {
  const [name, setName] = useState('');
  
  return (
    <div className="joinOuterContainer">
      <div className="existRoomContainer">
        <div className="roomListContainer">  
        </div>
      </div>
      <div className="joinInnerContainer">
        <h1 className="heading">Log In</h1>
        <div><input placeholder="Name" className="joinInputName" type="text" onChange={(event) => setName(event.target.value)} /></div>
        <Link onClick={event => (!name) ? event.preventDefault() : null} to={`/roomList?name=${name}`}>
          <button className="button" type="submit">Log In</button>
        </Link>
      </div>
    </div>
  )
}

export default Join;