import React from 'react';

import './Room.css';

const Room = ({user, room}) => {
  return(
    <div>
      user: {user} room: {room} 
    </div>
  )
}

export default Room;