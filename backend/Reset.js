const BOARD_SIZE = 19;

var initData = function(lived, turn, x, y) {
  this.lived = lived;
  this.turn = turn;
  this.kill_x = x;
  this.kill_y = y;
}

function resetBoard(board) {
  for(let i = 0; i< BOARD_SIZE; i++) {
    for(let j = 0; j < BOARD_SIZE; j++) {
      board[i][j] = new initData(false, -1,null,null);
    }
  }
  
  console.log('reset complete');
  return board;
}

module.exports = resetBoard;