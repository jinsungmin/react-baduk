import React, { Component } from 'react';
import Cell from './components/Cell';
import Data from './Data';
import axios from "axios";

const whiteStone = require('./assets/img/white-stone.png');
const blackStone = require('./assets/img/black-stone.png');

const CELL_SIZE = 36;
const BOARD_SIZE = 19;

class App extends Component {
  constructor(props) {
    super(props);

    this.boardWidth = CELL_SIZE * BOARD_SIZE;
    this.grid = Array.apply(null, Array(BOARD_SIZE)).map((el, idx) => {
      return Array.apply(null, Array(BOARD_SIZE)).map((el, idx) => {
        return null;
      });
    });

    this.state = {
      turn: 0,
      dieBS: 0,
      dieWS: 0,
    }
  
    this.postClickedCellInfor = this.postClickedCellInfor.bind(this);
  }

  componentWillMount() {
    this.resetGame = this.resetGame.bind(this);

    if (window.performance) {
      if (performance.navigation.type == 1) {
        this.resetGame();
      }
    }
  }

  callBackServer = async (x, y) => {
    await axios.get('/data').then((data) => {
      //console.log("backserver data : ", data.data);
      if(this.state.turn === data.data.board[x][y].turn) {
        alert('It is a place that cannot be placed');
      }
      this.setState({
        turn: data.data.board[x][y].turn,
      }, () => {
        console.log('turn:', this.state.turn);

        for(let i = 0; i< BOARD_SIZE; i++) {
          for(let j = 0; j < BOARD_SIZE; j++) {
            this.setState({
              dieBS: data.data.deadStone.blackStone,
              dieWS: data.data.deadStone.whiteStone,
            }, () => {
              this.grid[i][j].setState({
                turn: data.data.board[i][j].turn,
                lived: data.data.board[i][j].lived,
              })
            })
          }
        }
      });
    });
  };

  postClickedCellInfor =  async (x, y) => {
    console.log('post:', x, y);
    await axios.post('/data', {
      data: {
        turn: this.state.turn,
        x: x,
        y: y,
      }
    })
    .then(function(response) {
      //console.log('callBack:',response);
    })
    .catch(function(error){
    });
    await this.callBackServer(x, y);
  }

  resetGame = async () => {
    await axios.get('/data/reset').then((data) => {
      //console.log("backserver data : ", data);
      this.setState({
        turn: 0,
      }, () => {
        for(let i = 0; i< BOARD_SIZE; i++) {
          for(let j = 0; j < BOARD_SIZE; j++) {
            this.setState({
              dieBS: data.data.deadStone.blackStone,
              dieWS: data.data.deadStone.whiteStone,
            }, () => {
              this.grid[i][j].setState({
                turn: data.data.board[i][j].turn,
                lived: data.data.board[i][j].lived,
                clicked: false,
              })
            })    
          }
        }     
      });
    });
    
  }

  countDeadStone = (color) => {
    if(color === this.state.dieBS) {
      return (
        <div>
          {this.state.dieBS}
        </div>
      )
    } else {
      return (
        <div>
          {this.state.dieWS}
        </div>
      )
    }
  }

  renderBoard = () => {
    return Array.apply(null, Array(BOARD_SIZE)).map((el, rowIdx) => {     
      let cellList = Array.apply(null, Array(BOARD_SIZE)).map((el, colIdx) => {
        
        return <Cell
          //turnCount={this.turnCount}
          postClickedCellInfor={this.postClickedCellInfor}
          key={colIdx}
          width={CELL_SIZE}
          height={CELL_SIZE}
          x={colIdx}
          y={rowIdx}
          ref={(ref) => { this.grid[colIdx][rowIdx] = ref}}
        />
      });
      
      return (
        <div 
        key={rowIdx} 
        style={{ 
          width: this.boardWidth, 
          height: CELL_SIZE, 
          display:'flex', 
          alignItems: 'flex-start' 
        }}>
          {cellList}
        </div>
      )
    });
  }

  render() {
    
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#EEEEEE',
        position: 'relative',
      }}>
        <div style={{ 
          width: this.boardWidth, 
          height: this.boardWidth, 
          backgroundColor: '#DDDDDD', 
          flexDirection: 'column',
          position: 'absolute',
          top: '50%',
          left: '30%',
          transform: 'translate(-50%, -50%)',
        }}>
          {this.renderBoard()}
        </div>
        <div style={{
          position: 'absolute',
          top: '2%',
          left: '40%',
        }}>
          <button 
            onClick={this.resetGame} 
            style={{
              width: 200, 
              height: 45, 
              border: '2px solid black',
              fontSize: 20,
              backgroundColor: 'white',
              color: 'red',
            }}
          >
            Reset
          </button>    
        </div>
        <div style={{
          position: 'absolute',
          top: '8%',
          left: '70%',
          backgroundColor: 'white',
        }}>
          <div style={{
            width: 400, 
            height: 680, 
            border: '1px solid black',
            fontSize: 20,
          }}>
            <div style={{
              width: 198,
              height: 680,
              display: 'inline-block',
              float: 'left',
              border: '1px solid black'
            }}>
              <img src={whiteStone} style={{ width:CELL_SIZE, height:CELL_SIZE}} />
              <br/>
              {this.countDeadStone(this.state.dieBS)}
            </div>
            <div style={{
              width: 198,
              height: 680,
              display: 'inline-block',
              float: 'left',
              border: '1px solid black'
            }}>
              <img src={blackStone} style={{ width:CELL_SIZE, height:CELL_SIZE}} />
              <br/>
              {this.countDeadStone(this.state.dieWS)}
            </div>
          </div>
        </div>
      </div> 
    );
  }
}

export default App;
