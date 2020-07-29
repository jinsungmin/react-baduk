import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom'; 

import Join from './components/Join/Join';
import Game from './components/Game/Game';
import RoomList from './components/RoomList/RoomList';
//import Form from './components/SetGame/MyModal';
import portal from './ModalPortal';

const App = () => (
  <Router>
    <Route path="/" exact component={Join} />
    <Route path="/game" exact component={Game} />
    <Route path="/roomList" exact component={RoomList} />
    <Route path="/1234" exact component={portal} />

  </Router>
);

export default App;
