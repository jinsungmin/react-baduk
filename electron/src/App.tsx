import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom'; 

import Join from './components/Join/Join';
import Game from './components/Game/Game';
import RoomList from './components/RoomList/RoomList';

const App = () => (
  <Router>
    <Route path="/" exact component={Join} />
    <Route path="/game" exact component={Game} />
    <Route path="/roomList" exact component={RoomList} />
  </Router>
);

export default App;
