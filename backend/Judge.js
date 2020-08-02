const BOARD_SIZE = 19;
const dr = [0,-1,0,1,1,-1,-1,1];
const dc = [-1,0,1,0,1,-1,1,-1];

let Dot = function(row, col, infor) {
  this.row = row;
  this.col = col;
  this.infor = infor;
}

let Score = function(order, score) {
  this.order = order;
  this.score = score;
}


async function Judge(map, deadStone) {
  let dct = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(false));
  let visited = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(false));
  let judgeBoard = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0));
  
  let tempCount = 0;
  let max = 0;

  let blackQueue = [];
  let whiteQueue = [];

  let blackCount = 0;
  let whiteCount = 0;

  let blackOrder = 0;
  let whiteOrder = 0;

  let findMaxQueue = [];


  await initJudgeBoard(map);

  //await print(judgeBoard);

  await findMaxQueue.push(new Dot(-1,-1,0));

  await findMaxStone(judgeBoard);
  
  await initArray(dct);

  let firstRow = findMaxQueue[0].row;
  let firstCol = findMaxQueue[0].col;

  console.log('check:', firstRow, firstCol);
  
  await find(firstRow, firstCol, judgeBoard[firstRow][firstCol]);

  await searchBoard(judgeBoard, dct);
  
  await countBlackStone();

  await countWhiteStone();
  
  //solveClashed();
  blackCount += deadStone.blackStone; // 반면 집 + 사석 
  whiteCount += deadStone.whiteStone;  // 반면 집 + 사석
  whiteCount += 6.5;  // 덤
  
  console.log("black Count: " + blackCount);
  console.log("white Count: " + whiteCount);

  let result = [];
  result.push(blackCount);
  result.push(whiteCount);
  console.log('result', result);
  return result;

  async function countBlackStone() {
    for(let i = 0; i< blackQueue.length; i++) {
      blackCount += blackQueue[i].score;
    }
  }
  
  async function countWhiteStone() {
    for(let i = 0; i< whiteQueue.length; i++) {
      whiteCount += whiteQueue[i].score;
    }
  }

  async function searchBoard(judgeBoard, dct) {
    for(let i = 0; i < BOARD_SIZE; i++) {
      for(let j = 0; j < BOARD_SIZE; j++) {
        if(!dct[i][j] && judgeBoard[i][j] > 0) 
          await find(i,j, judgeBoard[i][j]);
      }
    }
  }
  
  async function findMaxStone(judgeBoard) {
    for(let i = 0; i < BOARD_SIZE; i++) {
      for(let j = 0; j < BOARD_SIZE; j++) {
        if(!dct[i][j] && judgeBoard[i][j] > 0) { 
          await findMax(judgeBoard[i][j], i,j);
  
          if(max < tempCount) {
            max = tempCount;
            findMaxQueue.splice(0,1);
            findMaxQueue.push(new Dot(i,j, max));
          }
          tempCount = 0;
        }
      }
    }
  }
  
  
  function print(map) {
    for(let i = 0; i < BOARD_SIZE; i++) {
      for(let j = 0; j < BOARD_SIZE; j++) {
        process.stdout.write(map[i][j] + ' ');
      }
      process.stdout.write('\n');
    }
  
  }
  
  function initJudgeBoard(map) {
    for(let i = 0; i < BOARD_SIZE; i++) {
      for(let j = 0; j < BOARD_SIZE; j++) {
        if(map[j][i].turn % 2 == 1 && map[j][i].lived) {
          judgeBoard[i][j] = 2;
        } else if (map[j][i].turn % 2 == 0 && map[j][i].lived) {
          judgeBoard[i][j] = 1;
        }
      }
    }
  }
  
  function isInside(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }
  
  function initArray(arr) {
    for(let i = 0; i< BOARD_SIZE; i++) {
      for(let j = 0; j< BOARD_SIZE; j++) {
        arr[i][j] = false;
      }
    }
  }
  
  function findMax(value, i, j) {
    for(let v = 0; v < 4; v++) {
      if(isInside(i + dr[v], j + dc[v]) && judgeBoard[i + dr[v]][j + dc[v]] == value && !dct[i + dr[v]][j + dc[v]]) {
        dct[i + dr[v]][j + dc[v]] = true;
        tempCount += 1;
        findMax(value, i + dr[v], j + dc[v]);
      }
    }
  }
  
  async function find(row, col, color) {
    let number = 1;
    let board = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0));
    let emptyBoard = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0));
    board[row][col] = number;
    
    await check(judgeBoard[row][col], row, col, board, number);
    
    await bfs(judgeBoard[row][col], board, number, emptyBoard);
  }
  
  async function bfs(color, board, number, emptyBoard) {
    let queue = [];
    
    let start = 0;
    for(let i = 0; i < BOARD_SIZE; i++) {
      for(let j = 0; j< BOARD_SIZE; j++) {
        if(board[i][j] == number) {
          visited[i][j] = true;
          await queue.push(new Dot(i,j,color));
          start += 1;
        }
      }
    }
    let count = 0;
    
    while (queue.length != 0) {
      let temp = queue.splice(0,1);
      let tempRow = temp[0].row;
      let tempCol = temp[0].col;
      let tempColor = temp[0].infor;
  
      //console.log('temp:', temp, tempRow, tempCol, tempColor);
      
      for(let v = 0; v < 4; v++) {
        if(isInside(tempRow + dr[v], tempCol + dc[v]) 	// 보드 안의 범위 + 방문한 적 x + 기준 돌과 같은 돌 x
          && !visited[tempRow + dr[v]][tempCol + dc[v]]
          && board[tempRow + dr[v]][tempCol + dc[v]] == 0
          && emptyBoard[tempRow + dr[v]][tempCol + dc[v]] == 0
        ) { 
          if(judgeBoard[tempRow + dr[v]][tempCol + dc[v]] == 0) {	// 돌이 놓이지 않은 빈 공간
            visited[tempRow + dr[v]][tempCol + dc[v]] = true;
            count += 1;
            //clashed[tempRow + dr[v]][tempCol + dc[v]]--;
            queue.push(new Dot(tempRow + dr[v], tempCol + dc[v], tempColor));
          } else if(judgeBoard[tempRow + dr[v]][tempCol + dc[v]] == color) {
            visited[tempRow + dr[v]][tempCol + dc[v]] = true;
            dct[tempRow + dr[v]][tempCol + dc[v]] = true;
            queue.push(new Dot(tempRow + dr[v], tempCol + dc[v], tempColor));
            //clashed[tempRow + dr[v]][tempCol + dc[v]]--;
          }
        }
      }
    }
    if(count < 2) {
      if(color == 1) {
        blackQueue.push(new Score(blackOrder, start * 2 + count));
        blackOrder += 1;
        console.log('dead stone');
      } else if(color == 2) {
        whiteQueue.push(new Score(whiteOrder, start * 2 + count));
        whiteOrder += 1;
        console.log('dead stone');
      }
    } else {
      if(color == 2) {
        blackQueue.push(new Score(blackOrder, count));
        blackOrder += 1;
        console.log("black:", count);
      } else if(color == 1) {
        whiteQueue.push(new Score(whiteOrder, count));
        whiteOrder += 1;
        console.log("white:", count);
      }
    } 
  }
  
  function check(value, i, j, board, number) {
    for(let v = 0; v < 8; v++) {
      if(isInside(i + dr[v], j + dc[v]) && judgeBoard[i + dr[v]][j + dc[v]] == value && !dct[i + dr[v]][j + dc[v]]) {
        board[i + dr[v]][j + dc[v]] = number;
        dct[i + dr[v]][j + dc[v]] = true;
        
        if(v >= 4 && v <= 7) {
          switch(v) {
          case 4:
            if(isInside(i + dr[2], j + dc[2]) && isInside(i + dr[3], j + dc[3])
               && judgeBoard[i + dr[2]][j + dc[2]] > 0 && judgeBoard[i + dr[2]][j + dc[2]] != value
               && judgeBoard[i + dr[3]][j + dc[3]] > 0 && judgeBoard[i + dr[3]][j + dc[3]] != value) {
              board[i + dr[v]][j + dc[v]] = 0;
              dct[i + dr[v]][j + dc[v]] = false;
            }
            break;
          case 5:
            if(isInside(i + dr[0], j + dc[0]) && isInside(i + dr[1], j + dc[1])
               && judgeBoard[i + dr[0]][j + dc[0]] > 0 && judgeBoard[i + dr[0]][j + dc[0]] != value
               && judgeBoard[i + dr[1]][j + dc[1]] > 0 && judgeBoard[i + dr[1]][j + dc[1]] != value) {
              board[i + dr[v]][j + dc[v]] = 0;
              dct[i + dr[v]][j + dc[v]] = false;
            }
            break;
          case 6:
            if(isInside(i + dr[1], j + dc[1]) && isInside(i + dr[2], j + dc[2])
               && judgeBoard[i + dr[1]][j + dc[1]] > 0 && judgeBoard[i + dr[1]][j + dc[1]] != value
               && judgeBoard[i + dr[2]][j + dc[2]] > 0 && judgeBoard[i + dr[2]][j + dc[2]] != value) {
              board[i + dr[v]][j + dc[v]] = 0;
              dct[i + dr[v]][j + dc[v]] = false;
            }
            break;
          case 7:
            if(isInside(i + dr[0], j + dc[0]) && isInside(i + dr[3], j + dc[3])
               && judgeBoard[i + dr[3]][j + dc[3]] > 0 && judgeBoard[i + dr[3]][j + dc[3]] != value
               && judgeBoard[i + dr[0]][j + dc[0]] > 0 && judgeBoard[i + dr[0]][j + dc[0]] != value) {
              board[i + dr[v]][j + dc[v]] = 0;
              dct[i + dr[v]][j + dc[v]] = false;
            }
            break;
          }
        }
        if(board[i + dr[v]][j + dc[v]] != 0)
          check(value, i + dr[v], j + dc[v], board, number);
      }
    }
  }
}





module.exports = Judge;