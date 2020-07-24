import React from 'react';

import './InfoBar.css';

import closeIcon from '../../assets/img/exit-icon.png';
import onlineIcon from '../../assets/img/home-icon.png';

const InfoBar = ({ room, getOutRoom }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" style={{width: 50, height: 50,}} src={onlineIcon} alt="online image" />
      <h3>Room.{room}</h3>
    </div>
    <div className="rightInnerContainer">
      <a href="/"><img onClick={() => getOutRoom()}src={closeIcon} style={{width: 50, height: 50,}} alt="close image" /></a>
    </div>
  </div>
)

export default InfoBar;