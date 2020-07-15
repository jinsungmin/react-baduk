import React, {View, Component } from 'react';
import Cell from './components/Cell';

const CELL_SIZE = 40;
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
  }

  renderBoard = () => {
    return Array.apply(null, Array(BOARD_SIZE)).map((el, rowIdx) => {
      let cellList = Array.apply(null, Array(BOARD_SIZE)).map((el, colIdx) => {
        return <Cell 
          key={colIdx}
          width={CELL_SIZE}
          height={CELL_SIZE}
          x={colIdx} 
          y={rowIdx} 
          ref={(ref) => { this.grid[colIdx][rowIdx] = ref}}  
        />
      });

      return (
        <div key={rowIdx} style={{ width: this.boardWidth, height: CELL_SIZE, display:'flex', alignItems: 'flex-start' }}>
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
      </div> 
    );
  }
}

export default App;
