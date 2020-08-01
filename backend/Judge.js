const BOARD_SIZE = 19;
const dr = [0,-1,0,1,1,-1,-1,1];
const dc = [-1,0,1,0,1,-1,1,-1];
let tempCount = 0;
let max = 0;

let dct = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(false));
let visited = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(false));

let blackOrder = 0;
let whiteOrder = 0;

let Dot = function(row, col, infor) {
  this.row = row;
  this.col = col;
  this.infor = infor;
}

let Score = function(order, score) {
  this.order = order;
  this.score = score;
}

let blackQueue = [];
let whiteQueue = [];

let findMaxQueue = [];

async function Judge(map, deadStone) {
  
  findMaxQueue.push(new Dot(-1,-1,0));

  for(let i = 0; i < BOARD_SIZE; i++) {
    for(let j = 0; j < BOARD_SIZE; j++) {
      if(!dct[i][j] && map[i][j] > 0) { 
        findMax(i,j, map[i][j]);
        if(max < tempCount) {
          max = tempCount;
          findMaxQueue.remove(0);
          findMaxQueue.push(new Dot(i,j, max));
        }
        tempCount = 0;
      }
    }
  }

  initArray(dct);

  let firstRow = findMaxQueue[0].row;
  let firstCol = findMaxQueue[0].col;
  
  find(firstRow, firstCol, map[firstRow][firstCol]);

  for(let i = 0; i < BOARD_SIZE; i++) {
    for(let j = 0; j < BOARD_SIZE; j++) {
      if(!dct[i][j] && map[i][j] > 0) 
        find(i,j, map[i][j]);
    }
  }
  
  for(let i = 0; i< blackQueue.length; i++) {
    blackCount += blackQueue[i].score;
  }
  for(let i = 0; i< whiteQueue.length; i++) {
    whiteCount += whiteQueue[i].score;
  }
  
  //solveClashed();
  blackCount += deadStone.whiteStone; // 반면 집 + 사석 
  whiteCount += deadStone.blackStone  // 반면 집 + 사석
  whiteCount += 6.5;  // 덤
  
  console.log("black Count: " + blackCount);
  console.log("white Count: " + whiteCount);
  
}

function isInside(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function judgeEmptyPlace(grid, judgeBoard, row, col) {

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
    if(isInside(i + dr[v], j + dc[v]) && map[i + dr[v]][j + dc[v]] == value && !dct[i + dr[v]][j + dc[v]]) {
      dct[i + dr[v]][j + dc[v]] = true;
      tempCount++;
      findMax(value, i + dr[v], j + dc[v]);
    }
  }
}

function find(row, col, color) {
  let number = 1;
  let board = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0));
  let emptyBoard = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0));
  board[row][col] = number;
  
  check(map[row][col], row, col, board, number);
  
  bfs(map[row][col], board, number, emptyBoard);
}

function bfs(color, board, number, emptyBoard) {
  let queue = [];
  //LinkedList<Dot>queue = new LinkedList<Dot>();
  let start = 0;
  for(let i = 0; i < BOARD_SIZE; i++) {
    for(let j = 0; j< BOARD_SIZE; j++) {
      if(board[i][j] == number) {
        visited[i][j] = true;
        queue.push(new Dot(i,j,color));
        start++;
      }
    }
  }
  let count = 0;
  
  while (queue.length != 0) {
    let temp = queue.splice(0,1);
    let tempRow = temp.row;
    let tempCol = temp.col;
    let tempColor = temp.color;
    
    for(let v = 0; v < 4; v++) {
      if(isInside(tempRow + dr[v], tempCol + dc[v]) 	// 보드 안의 범위 + 방문한 적 x + 기준 돌과 같은 돌 x
        && !visited[tempRow + dr[v]][tempCol + dc[v]]
        && board[tempRow + dr[v]][tempCol + dc[v]] == 0
        && emptyBoard[tempRow + dr[v]][tempCol + dc[v]] == 0
      ) { 
        if(map[tempRow + dr[v]][tempCol + dc[v]] == 0) {	// 돌이 놓이지 않은 빈 공간
          visited[tempRow + dr[v]][tempCol + dc[v]] = true;
          count++;
          //clashed[tempRow + dr[v]][tempCol + dc[v]]--;
          queue.push(new Dot(tempRow + dr[v], tempCol + dc[v], tempColor));
        } else if(map[tempRow + dr[v]][tempCol + dc[v]] == color) {
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
      blackOrder++;
    } else if(color == 2) {
      whiteQueue.push(new Score(whiteOrder, start * 2 + count));
      whiteOrder++;
    }
  } else {
    if(color == 2) {
      blackQueue.push(new Score(blackOrder, count));
      blackOrder++;
      console.log("black:", count);
    } else if(color == 1) {
      whiteQueue.push(new Score(whiteOrder, count));
      whiteOrder++;
      console.log("white:", count);
    }
  } 
}

function check(value, i, j, board, number) {
  for(let v = 0; v < 8; v++) {
    if(isInside(i + dr[v], j + dc[v]) && map[i + dr[v]][j + dc[v]] == value && !dct[i + dr[v]][j + dc[v]]) {
      board[i + dr[v]][j + dc[v]] = number;
      dct[i + dr[v]][j + dc[v]] = true;
      
      if(v >= 4 && v <= 7) {
        switch(v) {
        case 4:
          if(isInside(i + dr[2], j + dc[2]) && isInside(i + dr[3], j + dc[3])
             && map[i + dr[2]][j + dc[2]] > 0 && map[i + dr[2]][j + dc[2]] != value
             && map[i + dr[3]][j + dc[3]] > 0 && map[i + dr[3]][j + dc[3]] != value) {
            board[i + dr[v]][j + dc[v]] = 0;
            dct[i + dr[v]][j + dc[v]] = false;
          }
          break;
        case 5:
          if(isInside(i + dr[0], j + dc[0]) && isInside(i + dr[1], j + dc[1])
             && map[i + dr[0]][j + dc[0]] > 0 && map[i + dr[0]][j + dc[0]] != value
             && map[i + dr[1]][j + dc[1]] > 0 && map[i + dr[1]][j + dc[1]] != value) {
            board[i + dr[v]][j + dc[v]] = 0;
            dct[i + dr[v]][j + dc[v]] = false;
          }
          break;
        case 6:
          if(isInside(i + dr[1], j + dc[1]) && isInside(i + dr[2], j + dc[2])
             && map[i + dr[1]][j + dc[1]] > 0 && map[i + dr[1]][j + dc[1]] != value
             && map[i + dr[2]][j + dc[2]] > 0 && map[i + dr[2]][j + dc[2]] != value) {
            board[i + dr[v]][j + dc[v]] = 0;
            dct[i + dr[v]][j + dc[v]] = false;
          }
          break;
        case 7:
          if(isInside(i + dr[0], j + dc[0]) && isInside(i + dr[3], j + dc[3])
             && map[i + dr[3]][j + dc[3]] > 0 && map[i + dr[3]][j + dc[3]] != value
             && map[i + dr[0]][j + dc[0]] > 0 && map[i + dr[0]][j + dc[0]] != value) {
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

module.exports = Judge;