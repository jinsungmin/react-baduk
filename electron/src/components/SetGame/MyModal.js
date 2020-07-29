import React from 'react';
import './MyModal.css';

const MyModal = ({ onClose, onSubmit, time, color }) => {
  
  let selectedTime = '10';
  let selectedColor= 'auto';
  

  const onFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedTime, selectedColor);
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
          onChange={(e) => {selectedTime = e.target.value}}  
        >
          <option value="">Time</option>
          <option value="5">5분</option>
          <option value="10">10분</option>
          <option value="30">30분</option>
          <option value="60">1시간</option>
        </select><br/><br/>
        돌 선택:  
        <select 
          className="comboBox margin-left" 
          name="color"
          onChange={(e) => {selectedColor = e.target.value}}
        >
          <option value="">Color</option>
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