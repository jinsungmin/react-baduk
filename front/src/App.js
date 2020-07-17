import React, { Component } from 'react';
import Cell from './components/Cell';

import Rule from './Rule';

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
    }

    this.turnCount = this.turnCount.bind(this);
  }

  turnCount = (x, y) => {
    const { turn } = this.state;
    
    this.setState({
      turn: turn + 1,
    }, () => {
      this.grid[x][y].setState({
        turn: this.state.turn,
        lived: true,
      }, () => {
        console.log('turn is', this.grid[x][y].state.turn);
        //alert("(" + x + ", " + y + ")");
        //Rule(this.grid, x, y);
        Rule(this.grid, x, y, this);
        
      })
    });
  }
  /*
  turnBack = (grid,x,y) => {
    return new Promise(function(resolve, reject) {
      Rule(grid, x, y);
      console.log('1');
      resolve();
    })
  }
  */

  resetGame = () => {
    for(let i = 0; i<BOARD_SIZE; i++) {
      for(let j = 0; j<BOARD_SIZE; j++) {
        this.grid[i][j].reset();
      }
    }
    this.setState({
      turn: 0,
    })
  }

  renderBoard = () => {
    return Array.apply(null, Array(BOARD_SIZE)).map((el, rowIdx) => {     
      let cellList = Array.apply(null, Array(BOARD_SIZE)).map((el, colIdx) => {
        
        return <Cell
          turnCount={this.turnCount}
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
            
            </div>
            <div style={{
              width: 198,
              height: 680,
              display: 'inline-block',
              float: 'left',
              border: '1px solid black'
            }}>
              <img src={blackStone} style={{ width:CELL_SIZE, height:CELL_SIZE}} />
            </div>
          </div>
        </div>
      </div> 
    );
  }
}

export default App;
