import React from 'react';

import './InfoBar.css';

import closeIcon from '../../assets/img/black-stone.png';
import onlineIcon from '../../assets/img/white-stone.png';

const InfoBar = ({ room }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="online image" />
      <h3>{room}</h3>
    </div>
    <div className="rightInnerContainer">
      <a href="/"><img src={closeIcon} alt="close image" /></a>
    </div>
  </div>
)

export default InfoBar;