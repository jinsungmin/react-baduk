/*
  한 수가 놓일 때 마다 바둑판 전체를 체크해서 룰을 적용한 결과를 다시 반환.
*/

const CELL_SIZE = 36;
const BOARD_SIZE = 19;
const dx = [-1, 0, 1, 0];
const dy = [0, 1, 0, -1];

let change;
function Rule(grid) {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      change = Check(grid, i, j);
      //console.log(change);  //살면 true
      
      if (grid[i][j].state.lived && !change) { // 살아있던 돌이 죽었을때
        grid[i][j].setState({
          lived: false,
        }, () => {
          console.log('die:', grid[i][j].state.lived);
        })
      }
      
    }
  }
}

function isInside(x, y) {
  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

function Check(grid, x, y) {    // 돌의 사망을 판별
  let lived = false;
  if (grid[x][y].state.lived) {
    lived = true;
    let count = 0;
    for (let i = 0; i < 4; i++) {
      if (grid[x][y].state.turn % 2 == 0) { // white-stone
        if (isInside(x + dx[i], y + dy[i]) && grid[x + dx[i]][y + dy[i]].state.lived && grid[x + dx[i]][y + dy[i]].state.turn % 2 == 1) {  // 반대편 돌일 경우
          count++;
        }
        if (count == 4) {
          lived = false;
        }
      }

      // 
      if (grid[x][y].state.turn % 2 == 1) { // black-stone
        if (isInside(x + dx[i], y + dy[i]) && grid[x + dx[i]][y + dy[i]].state.lived && grid[x + dx[i]][y + dy[i]].state.turn % 2 == 0) {  // 반대편 돌일 경우
          count++;
        }
        if (count == 4) {
          lived = false;
        }
      }
    }
  }
  return lived;
}

export default Rule;