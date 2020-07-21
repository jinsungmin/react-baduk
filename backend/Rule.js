/*
  한 수가 놓일 때 마다 바둑판 전체를 체크해서 룰을 적용한 결과를 다시 반환.
*/

const BOARD_SIZE = 19;
const dx = [-1, 0, 1, 0];
const dy = [0, 1, 0, -1];
let deathCount = 0;

async function Rule(grid, data, deadStone) {
  
  grid[data.x][data.y].turn = data.turn + 1;
  grid[data.x][data.y].lived = true;

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      // 입력한 돌과 색이 같지 않은 돌 && 살아있는 돌 
      if ((grid[i][j].turn % 2 != grid[data.x][data.y].turn % 2) && grid[i][j].lived) {
        await checkLife(grid, i, j, data.x, data.y); // 입력한 돌이 잡을 수 있는 돌을 판별
      }
    }
  }

  // 사석 추가
  await addDeadStone(grid, data, deadStone);

  // 입력한 돌의 생사 확인.
  await checkLife(grid, data.x, data.y, data.x, data.y);
  
  console.log('now:', grid[data.x][data.y].turn);
  return grid;
}

function addDeadStone(grid, data, deadStone) {
  if (grid[data.x][data.y].turn % 2 == 0) {
    deadStone.whiteStone += deathCount;
  } else {
    deadStone.blackStone += deathCount;
  }
  deathCount = 0;
}

function isInside(x, y) {
  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

function checkLife(grid, x, y, ox, oy) { // 죽은 돌 제거
  let dct = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(false));
  if (grid[x][y].lived) { // 기준 돌이 살아있을 경우
    dct[x][y] = true;
    
    findSameStone(grid, grid[x][y].turn % 2, x, y, dct);
    
    let lived = surround(grid, dct);
    let banned = 0;
    let pae = true;
    if (lived != 1) {
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (lived == 2) { //기준 돌이 둘러싸여 있고 둘러싼 돌의 개수가 '<= 4' 일  경우
            if (dct[i][j]) {
              pae = ban(grid, ox, oy, i, j);
              if (pae) {
                grid[ox][oy].kill_x = i;
                grid[ox][oy].kill_y = j;

                if (i != ox && j != oy)
                    banned = 1;
              }
            }
          }

          if (dct[i][j]) {  // 기준 돌로 부터 연속된 돌들
            if (pae) {
              if (i == ox && j == oy && banned != 1) { // 자살수 금지.
                grid[ox][oy].lived = false;
                grid[ox][oy].turn -= 1;
                //alert('banned');

              } else {  // 죽은 돌 제거
                if (x != ox || y != oy) {
                  grid[i][j].lived = false;
                  deathCount += 1;
                }
              }
            } else {
              console.log('pae');
              
              grid[ox][oy].lived = false;
              grid[ox][oy].turn -= 1;
              //alert('pae');
            }
          }
        }
      }
    }
  }
}

function ban(grid, x, y, v, w) {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (grid[i][j].turn == grid[x][y].turn - 1 && grid[x][y].turn >= 2) {
        if (grid[i][j].kill_x + i == v + x &&
          grid[i][j].kill_y + j == w + y) {
          return false;
        }

      }
    }
  }
  return true;
}

function surround(grid, dct) {
  let surStone = 0;
  let sur = 0;

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (dct[i][j]) {
        for (let v = 0; v < 4; v++) {
          if (isInside(i + dx[v], j + dy[v])) {
            // 인접한 것중 기준 돌과 다른 것 전부 체크
            if ((grid[i + dx[v]][j + dy[v]].turn % 2 != grid[i][j].turn % 2) || !grid[i + dx[v]][j + dy[v]].lived) {
              sur++;
            }
            // 인접한 것중 기준 돌과 다른 색의 돌 전부 체크
            if ((grid[i + dx[v]][j + dy[v]].turn % 2 != grid[i][j].turn % 2) && grid[i + dx[v]][j + dy[v]].lived) {
              surStone++;
            }
          }
        }
      }
    }
  }

  if ((surStone == sur) && surStone != 0) {
    if (surStone <= 4) {
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
      && grid[i + dx[v]][j + dy[v]].lived     // 살아있는돌
      && (grid[i + dx[v]][j + dy[v]].turn % 2 == value)   // 같은 색의 돌
      && !dct[i + dx[v]][j + dy[v]]) {  // 탐색하지 않은 돌
      dct[i + dx[v]][j + dy[v]] = true;
      findSameStone(grid, value, i + dx[v], j + dy[v], dct);
    }
  }
}

module.exports = Rule;