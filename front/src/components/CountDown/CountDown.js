import React, { useState, useEffect } from 'react';

//import './InfoBar.css';



const CountDown = ({turn, color}) => {
  const [counter, setCounter] = useState(1800);
  
  useEffect(() => {
    if(turn % 2 === color) {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
    }
  }, [counter, turn]);

  function pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
  }

  return (
    <div className="countDown">
      <div>{pad(parseInt(counter / 60),2)}:{pad(parseInt(counter % 60), 2)} </div>
    </div>
  )
}

export default CountDown;