import React from 'react';

import './InfoBar.css';

import closeIcon from '../../assets/img/exit-icon.png';
import onlineIcon from '../../assets/img/home-icon.png';

const InfoBar = ({ name, room, getOutRoom }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" style={{width: 40, height: 40}} src={onlineIcon} alt="online image" />
      <h3>Room.{room}</h3>
    </div>
    <div className="rightInnerContainer">
      <a href={`/roomList?name=${name}`}><img onClick={() => getOutRoom(name)} src={closeIcon} style={{width: 25, height: 25}} alt="close image" /></a>
      
    </div>
  </div>
)

export default InfoBar;