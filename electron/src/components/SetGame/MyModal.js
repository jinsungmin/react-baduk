import React, { useState, useEffect } from 'react';
import './MyModal.css';

const MyModal = ({ onClose, onSubmit, time, color }) => {
  const [itemTime, setItemTime] = useState('10분');
  const [itemColor, setItemColor] = useState('자동돌가림');
  const [colorValue, setColorValue] = useState('auto');
  const [timeValue, setTimeValue] = useState('10');

  useEffect(() => { 
    if(time === '60') {
      setItemTime('1시간');
    } else {
      setItemTime(time + '분');
    }
  }, [time]);

  useEffect(() => {
    setTimeValue(time);
  }, [time]);

  useEffect(() => {
    if(color === 'auto') {
      setItemColor('자동돌가림');
    } else {
      if(color === 'black') {
        setItemColor('백돌');
      }
      if(color === 'white') {
        setItemColor('흑돌');
        
      }
    }    
  }, [color]);

  useEffect(() => {
    if(color === 'auto') {
      setColorValue('auto');
    } else {
      if(color === 'black') {
        setColorValue('white');
      }
      if(color === 'white') {
        setColorValue('black');
      }
    }    
  }, [color]);
  /*
  let showTime;
  let showColor;
  let colorValue;
  */
  /*
  if(time === '60') {
    showTime = '1시간';
  } else {
    showTime = time + '분';
  }

  if(color === 'auto') {
    showColor = '자동돌가림';
    colorValue = 'auto';
  } else {
    if(color === 'black') {
      showColor = '백돌';
      colorValue = 'white';
    }
    if(color === 'white') {
      showColor = '흑돌';
      colorValue = 'black';
    }
  }    
  */
  const onFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(timeValue, colorValue);
    onClose();
  }
  
  return (
    <div className="MyModal">
      <form name="gameSet" onSubmit={onFormSubmit}>
      <div className="content">
        <h3>Game Set</h3>
        제한 시간: 
        <select 
          className="comboBox"
          name="time"
          onChange={(e) => {setTimeValue(e.target.value)}}  
        >
          <option value={timeValue}>{itemTime}</option>
          <option value="10">10분</option>
          <option value="30">30분</option>
          <option value="60">1시간</option>
        </select><br/><br/>
        돌 선택:
        <select 
          className="comboBox margin-left" 
          name="color"
          onChange={(e) => {setColorValue(e.target.value)}}
        >
          <option value={colorValue}>{itemColor}</option>
          <option value="auto">자동돌가림</option>
          <option value="black">흑돌</option>
          <option value="white">백돌</option>
        </select><br/><br/><br/><br/>
        <button className="form_button" type="submit">확인</button>
        <button className="form_button" onClick={onClose}>닫기</button>
      </div>  
      </form>    
    </div>
  );
};

export default MyModal;