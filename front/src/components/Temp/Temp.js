import React, { Component } from 'react';
import Cell from './Cell';
import axios from 'axios';

const whiteStone = require('../../assets/img/white-stone.png');
const blackStone = require('../../assets/img/black-stone.png');

const CELL_SIZE = 36;
const BOARD_SIZE = 19;

let turn;

class Temp extends Component {
  constructor(props) {
    super(props);

    this.boardWidth = CELL_SIZE * BOARD_SIZE;
    this.grid = Array.apply(null, Array(BOARD_SIZE)).map((el, idx) => {
      return Array.apply(null, Array(BOARD_SIZE)).map((el, idx) => {
        return null;
      });
    });

    this.state = {
      dieBS: 0,
      dieWS: 0,
    }
    //this.resetGame = this.resetGame.bind(this);
    this.postClickedCellInfor = this.postClickedCellInfor.bind(this);
  }
  /*
  componentWillMount() {
    if (window.performance) {
      if (performance.navigation.type === 1) {
        this.resetGame();
      }
    }
  }
  */
  callBackServer = async (x, y) => {
    await axios.get('/data').then((data) => {
      //console.log("backserver data : ", data.data);
      //console.log('get turn:', data.data.board[x][y].turn);
      if(turn === data.data.board[x][y].turn) {
        alert('It is a place that cannot be place');
      }
     
      console.log('turn:', data.data.board[x][y].turn);
      console.log('test DS:', data.data.deadStone.blackStone, data.data.deadStone.whiteStone);
        
      for(let i = 0; i< BOARD_SIZE; i++) {
        for(let j = 0; j < BOARD_SIZE; j++) {
          this.grid[i][j].setState({
            turn: data.data.board[i][j].turn,
            lived: data.data.board[i][j].lived,
          })
          
        }
      }

      this.props.placeStone(data.data.board[x][y].turn);
    });
    
  };

  postClickedCellInfor =  async (x, y) => {
    console.log('post(turn,x,y): ',turn, x, y);
    await axios.post('/data', {
      data: {
        turn: turn,
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
  /*
  resetGame = async () => {
    await axios.get('/data/reset').then((data) => {
      this.setState({
        turn: this.props.turn,
      }, () => {
        for(let i = 0; i< BOARD_SIZE; i++) {
          for(let j = 0; j < BOARD_SIZE; j++) {
            this.setState({
              dieBS: data.data.deadStone.blackStone,
              dieWS: data.data.deadStone.whiteStone,
            }, () => {
              this.grid[i][j].setState({
                turn: 0,
                lived: data.data.board[i][j].lived,
                clicked: false,
              })
            })    
          }
        }     
      });
    });
  }
  */

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
    turn = this.props.turn;
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
            //onClick={this.resetGame} 
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
        <div>
          {this.props.turn}
        </div>
      </div> 
    );
  }
}

export default Temp;
