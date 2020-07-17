/*
  한 수가 놓일 때 마다 바둑판 전체를 체크해서 룰을 적용한 결과를 다시 반환.
*/


const BOARD_SIZE = 19;
const dx = [-1, 0, 1, 0];
const dy = [0, 1, 0, -1];

function Rule(grid, x, y, component) {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {

      if ((grid[i][j].state.turn % 2 != grid[x][y].state.turn % 2) && grid[i][j].state.lived) {
        checkLife(grid, i, j, x, y, component);
      }
    }
  }

}

function ban(grid, x, y, v, w) {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (grid[i][j].state.turn == grid[x][y].state.turn - 1 && grid[x][y].state.turn >= 2) {
        console.log('prev', grid[i][j].state.kill, i, j);
        console.log('pre:', v, w, x, y);

        if (grid[i][j].state.kill.x + i == v + x &&
          grid[i][j].state.kill.y + j == w + y) {
          return false;
        }

      }
    }
  }
  return true;
}

function isInside(x, y) {
  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

function checkLife(grid, x, y, ox, oy, component) { // 죽은 돌 제거
  let dct = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(false));
  if (grid[x][y].state.lived) { // 기준 돌이 살아있을 경우
    dct[x][y] = true;

    findSameStone(grid, grid[x][y].state.turn % 2, x, y, dct);
    let lived = surround(grid, dct);
    let pae = true;
    if (lived != 1) {
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {

          if (lived == 2) {
            if (dct[i][j]) {
              pae = ban(grid, ox, oy, i, j);
              if (pae) {
                grid[ox][oy].setState({
                  kill: {
                    x: i,
                    y: j,
                  }
                }, () => {
                })
              }
            }
          }
          if (dct[i][j]) {
            if (pae) {
              grid[i][j].setState({
                lived: false,
              });
            } else {
              console.log('pae');
              grid[ox][oy].setState({
                lived: false,
                clicked: false,
                turn: grid[ox][oy].state.turn - 1,
              }, () => {
                component.setState({
                  turn: grid[ox][oy].state.turn,
                }, () => {
                  //console.log('final turn:', component.state.turn);
                  alert('pae');
                })
              })
            }
          }
        }
      }
    }
  }
}

function surround(grid, dct) {
  let surStone = 0;
  let sur = 0;

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (dct[i][j]) {
        //console.log('dct:', i, j);
        for (let v = 0; v < 4; v++) {
          if (isInside(i + dx[v], j + dy[v])) {
            // 인접한 것중 기준 돌과 다른 것 전부 체크
            if ((grid[i + dx[v]][j + dy[v]].state.turn % 2 != grid[i][j].state.turn % 2) || !grid[i + dx[v]][j + dy[v]].state.lived) {
              sur++;
            }
            // 인접한 것중 기준 돌과 다른 색의 돌 전부 체크
            if ((grid[i + dx[v]][j + dy[v]].state.turn % 2 != grid[i][j].state.turn % 2) && grid[i + dx[v]][j + dy[v]].state.lived) {
              surStone++;
            }
          }
        }
      }
    }
  }

  if ((surStone == sur) && surStone != 0) {
    if (surStone == 4) {
      return 2;
    }
    return 0;
  } else {
    return 1;
  }
}

function findSameStone(grid, value, i, j, dct) { // 찾을 돌과 이어져 있는 동일한 색의 돌 수 탐색 
  for (let v = 0; v < 4; v++) {
    if (isInside(i + dx[v], j + dy[v])
      && grid[i + dx[v]][j + dy[v]].state.lived     // 살아있는돌
      && (grid[i + dx[v]][j + dy[v]].state.turn % 2 == value)   // 같은 색의 돌
      && !dct[i + dx[v]][j + dy[v]]) {  // 탐색하지 않은 돌
      dct[i + dx[v]][j + dy[v]] = true;
      findSameStone(grid, value, i + dx[v], j + dy[v], dct);
    }
  }
}

export default Rule;