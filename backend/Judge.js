const BOARD_SIZE = 19;
const dr = [0, -1, 0, 1, 1, -1, -1, 1];
const dc = [-1, 0, 1, 0, 1, -1, 1, -1];

let Dot = function (row, col, infor) {
    this.row = row;
    this.col = col;
    this.infor = infor;
}

async function Judge(map, deadStone) {
    let dct = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(false));
    let visited = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(false));
    let judgeBoard = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0));

    let freedom = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0));
    let colorCheck = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0));
    let controlFree = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0));
    let showScore = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0));

    let tempCount = 0;
    let max = 0;

    let blackCount = 0;
    let whiteCount = 0;

    let surround = 0;

    let findMaxQueue = [];

    await initJudgeBoard(map);

    await print(judgeBoard);

    await findMaxQueue.push(new Dot(-1, -1, 0));

    await findMaxStone(judgeBoard);

    await initArray(dct);

    let firstRow = findMaxQueue[0].row;
    let firstCol = findMaxQueue[0].col;

    console.log('check:', firstRow, firstCol);

    await find(firstRow, firstCol, judgeBoard[firstRow][firstCol]);

    await searchBoard(judgeBoard, dct);

    await adjustScore();

    blackCount += deadStone.blackStone; // 반면 집 + 사석
    whiteCount += deadStone.whiteStone;  // 반면 집 + 사석
    whiteCount += 6.5;  // 덤

    //console.log(blackCount, whiteCount);

    await printScore();

    await print(showScore);

    let result = [];
    result.push(blackCount);
    result.push(whiteCount);
    console.log('result', result);
    return result;

    async function searchBoard(judgeBoard, dct) {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (!dct[i][j] && judgeBoard[i][j] > 0)
                    await find(i, j, judgeBoard[i][j]);
            }
        }
    }

    async function findMaxStone(judgeBoard) {   // 보드 위의 가장 많은 동일한 색의 돌들로 이어진 좌표들 findMaxQueue에 저장
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (!dct[i][j] && judgeBoard[i][j] > 0) {
                    await findMax(judgeBoard[i][j], i, j);

                    if (max <= tempCount) {
                        max = tempCount;
                        findMaxQueue.splice(0, 1);
                        findMaxQueue.push(new Dot(i, j, max));
                    }
                    tempCount = 0;
                }
            }
        }
    }

    function print(board) {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                process.stdout.write(board[i][j] + ' ');
            }
            process.stdout.write('\n');
        }
    }

    function initJudgeBoard(map) {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (map[j][i].turn % 2 === 1 && map[j][i].lived) {
                    judgeBoard[i][j] = 2;
                } else if (map[j][i].turn % 2 === 0 && map[j][i].lived) {
                    judgeBoard[i][j] = 1;
                }
            }
        }
    }

    function isInside(row, col) {
        return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
    }

    function initArray(arr) {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                arr[i][j] = false;
            }
        }
    }

    function findMax(value, i, j) {
        for (let v = 0; v < 4; v++) {
            if (isInside(i + dr[v], j + dc[v]) && judgeBoard[i + dr[v]][j + dc[v]] === value && !dct[i + dr[v]][j + dc[v]]) {
                dct[i + dr[v]][j + dc[v]] = true;
                tempCount += 1;
                findMax(value, i + dr[v], j + dc[v]);
            }
        }
    }

    async function find(row, col, color) {
        let number = 1;
        let board = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0));
        board[row][col] = number;

        await check(judgeBoard[row][col], row, col, board, number);

        await bfs(judgeBoard[row][col], board, number);
    }

    async function bfs(color, board, number) {
        let queue = [];

        let start = 0;
        let free = 0;

        let score = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0));
        let mine = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0));
        let freeSpace = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0));

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j] === number) {
                    visited[i][j] = true;
                    await queue.push(new Dot(i, j, color));
                    start += 1;
                    mine[i][j] = color;
                }
            }
        }
        let count = 0;

        while (queue.length !== 0) {
            let temp = queue.splice(0, 1);
            let tempRow = temp[0].row;
            let tempCol = temp[0].col;
            let tempColor = temp[0].infor;

            for (let v = 0; v < 4; v++) {
                if (isInside(tempRow + dr[v], tempCol + dc[v]) 	// 보드 안의 범위 + 방문한 적 x + 기준 돌과 같은 돌 x
                    && !visited[tempRow + dr[v]][tempCol + dc[v]]
                    && board[tempRow + dr[v]][tempCol + dc[v]] === 0
                ) {
                    if (judgeBoard[tempRow + dr[v]][tempCol + dc[v]] === 0) {	// 돌이 놓이지 않은 빈 공간
                        let variable = await compare(tempRow + dr[v], tempCol + dc[v], tempColor, 0);

                        console.log('check:', variable);

                        if (variable === tempColor) {
                            visited[tempRow + dr[v]][tempCol + dc[v]] = true;
                            count += 1;
                            await queue.push(new Dot(tempRow + dr[v], tempCol + dc[v], tempColor));
                            score[tempRow + dr[v]][tempCol + dc[v]] = tempColor;
                        } else if (variable === 0) {
                            free += 1;
                            controlFree[tempRow + dr[v]][tempCol + dc[v]] += 1;
                            freeSpace[tempRow + dr[v]][tempCol + dc[v]] = 1;
                        }
                    } else if (await judgeBoard[tempRow + dr[v]][tempCol + dc[v]] === color) {
                        visited[tempRow + dr[v]][tempCol + dc[v]] = true;
                        dct[tempRow + dr[v]][tempCol + dc[v]] = true;
                        await queue.push(new Dot(tempRow + dr[v], tempCol + dc[v], tempColor));
                    }
                }
            }
        }
        if (count < 2) {
            if (color === 1) {
                blackCount += start;

                for (let i = 0; i < BOARD_SIZE; i++) {
                    for (let j = 0; j < BOARD_SIZE; j++) {
                        if (showScore[i][j] === 0 && score[i][j] !== 0)
                            showScore[i][j] = 2;
                        if (showScore[i][j] === 0 && mine[i][j] !== 0) {
                            showScore[i][j] = 2;
                        }
                        if (showScore[i][j] === 0 && freeSpace[i][j] !== 0) {
                            showScore[i][j] = 2;
                            freeSpace[i][j] -= 1;
                        }
                    }
                }
            } else if (color === 2) {
                whiteCount += start;

                for (let i = 0; i < BOARD_SIZE; i++) {
                    for (let j = 0; j < BOARD_SIZE; j++) {
                        if (showScore[i][j] === 0 && score[i][j] !== 0)
                            showScore[i][j] = 1;
                        if (showScore[i][j] === 0 && mine[i][j] !== 0) {
                            showScore[i][j] === 1;
                        }
                        if (showScore[i][j] === 0 && freeSpace[i][j] !== 0) {
                            showScore[i][j] = 1;
                            freeSpace[i][j] -= 1;
                        }
                    }
                }
            }
        } else {
            if (color === 2) {
                for (let i = 0; i < BOARD_SIZE; i++) {
                    for (let j = 0; j < BOARD_SIZE; j++) {
                        if (showScore[i][j] === 0) {
                            showScore[i][j] = score[i][j];
                        }
                    }
                }
                console.log("black:", count);
            } else if (color === 1) {
                console.log("white:", count);
                for (let i = 0; i < BOARD_SIZE; i++) {
                    for (let j = 0; j < BOARD_SIZE; j++) {
                        if (showScore[i][j] === 0) {
                            showScore[i][j] = score[i][j];
                        }
                    }
                }
            }
        }
    }

    async function compare(row, col, color, add) {  // 입력된 좌표에 대한 흑, 백의 영향력 비교
        let blackPoint = 0;
        let whitePoint = 0;

        freedom[row][col] += 1;

        if (color === colorCheck[row][col]) {
            return -1;
        } else {
            colorCheck[row][col] = color;
        }

        let queue = [];
        let visited2 = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(false));
        let adjacent = false;

        queue.push(new Dot(row, col, 0));
        visited2[row][col] = true;

        let weight = 50;

        while (queue.length !== 0) {
            let temp = queue.splice(0, 1);
            let tempRow = temp[0].row;
            let tempCol = temp[0].col;

            if (weight > 1)
                weight /= 2;

            let adjBlack = 0;
            let adjWhite = 0;
            for (let v = 0; v < 8; v++) {
                if (isInside(tempRow + dr[v], tempCol + dc[v]) 	// 보드 안의 범위 + 방문한 적 x
                    && !visited2[tempRow + dr[v]][tempCol + dc[v]]) {
                    if (judgeBoard[tempRow + dr[v]][tempCol + dc[v]] === 1) {
                        if (v >= 4 && v <= 7) {
                            if (weight > 0)
                                whitePoint += 0.2 * weight;
                        } else {
                            if (weight > 0)
                                whitePoint += weight;
                            if (adjWhite !== 0) {
                                adjacent = true;
                            }
                            adjBlack++;
                        }
                    } else if (judgeBoard[tempRow + dr[v]][tempCol + dc[v]] === 2) {
                        if (v >= 4 && v <= 7) {
                            if (weight > 0)
                                blackPoint += 0.2 * weight;
                        } else {
                            if (weight > 0)
                                blackPoint += weight;
                            if (adjBlack !== 0) {
                                adjacent = true;
                            }
                            adjWhite++;
                        }
                    }

                    if (whitePoint === 0 && blackPoint === 0) {
                        visited2[tempRow + dr[v]][tempCol + dc[v]] = true;
                        queue.push(new Dot(tempRow + dr[v], tempCol + dc[v], 0));
                    }

                }
            }
        }
        if (!adjacent && ((blackPoint - whitePoint >= 40) || (whitePoint === 0 && blackPoint !== 0))) {
            return 2;
        } else if (!adjacent && ((whitePoint - blackPoint >= 40) || (whitePoint !== 0 && blackPoint === 0))) {
            return 1;
        } else {
            if (add === 1) {
                if (blackPoint > whitePoint)
                    return 2;
                else return 1;
            }

            if (freedom[row][col] === 2)
                visited[row][col] = true;
            return 0;
        }
    }

    function adjustScore() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (controlFree[i][j] === 1) {
                    for (let v = 0; v < 4; v++) {
                        if (isInside(i + dr[v], j + dc[v]) && showScore[i + dr[v]][j + dc[v]] === 1) {
                            surround = 1;
                            break;
                        } else if (isInside(i + dr[v], j + dc[v]) && showScore[i + dr[v]][j + dc[v]] === 2) {
                            surround = 2;
                            break;
                        }
                    }

                    if (surround === 1) {
                        showScore[i][j] = 1;
                    } else if (surround === 2) {
                        showScore[i][j] = 2;
                    }
                }
            }
        }
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (showScore[i][j] === 1) {
                    whiteCount += 1;
                } else if (showScore[i][j] === 2) {
                    blackCount += 1;
                }
            }
        }
    }

    function printScore() {
        console.log('total Black score:', blackCount);
        console.log('total White score:', whiteCount);
    }

    function check(value, i, j, board, number) {
        for (let v = 0; v < 8; v++) {
            if (isInside(i + dr[v], j + dc[v]) && judgeBoard[i + dr[v]][j + dc[v]] === value && !dct[i + dr[v]][j + dc[v]]) {
                board[i + dr[v]][j + dc[v]] = number;
                dct[i + dr[v]][j + dc[v]] = true;

                if (v >= 4 && v <= 7) {
                    switch (v) {
                        case 4:
                            if (isInside(i + dr[2], j + dc[2]) && isInside(i + dr[3], j + dc[3])
                                && judgeBoard[i + dr[2]][j + dc[2]] > 0 && judgeBoard[i + dr[2]][j + dc[2]] !== value
                                && judgeBoard[i + dr[3]][j + dc[3]] > 0 && judgeBoard[i + dr[3]][j + dc[3]] !== value) {
                                board[i + dr[v]][j + dc[v]] = 0;
                                dct[i + dr[v]][j + dc[v]] = false;
                            }
                            break;
                        case 5:
                            if (isInside(i + dr[0], j + dc[0]) && isInside(i + dr[1], j + dc[1])
                                && judgeBoard[i + dr[0]][j + dc[0]] > 0 && judgeBoard[i + dr[0]][j + dc[0]] !== value
                                && judgeBoard[i + dr[1]][j + dc[1]] > 0 && judgeBoard[i + dr[1]][j + dc[1]] !== value) {
                                board[i + dr[v]][j + dc[v]] = 0;
                                dct[i + dr[v]][j + dc[v]] = false;
                            }
                            break;
                        case 6:
                            if (isInside(i + dr[1], j + dc[1]) && isInside(i + dr[2], j + dc[2])
                                && judgeBoard[i + dr[1]][j + dc[1]] > 0 && judgeBoard[i + dr[1]][j + dc[1]] !== value
                                && judgeBoard[i + dr[2]][j + dc[2]] > 0 && judgeBoard[i + dr[2]][j + dc[2]] !== value) {
                                board[i + dr[v]][j + dc[v]] = 0;
                                dct[i + dr[v]][j + dc[v]] = false;
                            }
                            break;
                        case 7:
                            if (isInside(i + dr[0], j + dc[0]) && isInside(i + dr[3], j + dc[3])
                                && judgeBoard[i + dr[3]][j + dc[3]] > 0 && judgeBoard[i + dr[3]][j + dc[3]] !== value
                                && judgeBoard[i + dr[0]][j + dc[0]] > 0 && judgeBoard[i + dr[0]][j + dc[0]] !== value) {
                                board[i + dr[v]][j + dc[v]] = 0;
                                dct[i + dr[v]][j + dc[v]] = false;
                            }
                            break;
                    }
                }
                if (board[i + dr[v]][j + dc[v]] !== 0)
                    check(value, i + dr[v], j + dc[v], board, number);
            }
        }
    }
}


module.exports = Judge;