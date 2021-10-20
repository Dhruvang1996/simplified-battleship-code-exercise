const readline = require("readline");
const alphabats = ['A','B','C','D','E','F','G','H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V','X','Y','Z'];

const board = (n) => {
  let arr=[];
  for (let i=0; i<=n; i++) {
    arr[i]=[];
    if (i===0) arr[i] = [' ', ...alphabats].slice(0,n+1);
    else arr[i].unshift(i,...new Array(n).fill('-'));
  }
  return arr;
};

const playerPosition = (player) => {
  const pos = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  });

  return new Promise((resolve, _) => {
    pos.question(`Please Enter the ship location for player ${player}. Format A3 A5 \n`, (answer) => {
      if (answer.split(' ').length === 2) {
        resolve(answer);
        pos.close();
      } else {
        playerPosition();
      }
    });
  });
};

const shipPositioning = (board, pos0, pos1, pos3, pos4) => {
  if (pos0 === pos3) {
    for (let i=pos1; i<=pos4; (pos1 < pos4) ? i++ : i--) {
      board[i][pos0] = 'S';
    }
  } else {
    for (let i=pos0; i<=pos3; (pos0 < pos3) ? i++ : i--) {
      board[pos1][i] = 'S';
    }
  }
};

const finishBoard = (n, board1, board2) => {
  console.log(`Congratulations Player ${n}: you sunk my battleship`);
  console.log('Player 1 Board:');
  for (let i = 0; i<board1.length; i++) {
    console.log(...board1[i]);
  }
  console.log('Player 2 Board:');
  for (let i = 0; i<board2.length; i++) {
    console.log(...board2[i]);
  }
}

const firePlayer = (n, board1, board2) => {
  const fire = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  });

  return new Promise((resolve, _) => {
    fire.question(`Player ${n}: Provide a location to heat Player ${n===1 ? 2 : 1} ship.\n`, async (answer) => {
      let ans = answer.trim();
      if (ans.length === 2) {
        fire.close();
        let column = board1[0].indexOf(ans[0]);
        let row = ans[1];
        if (n === 1) {
          if (board2[row][column] === 'S') {
            return finishBoard(n, board1, board2);
          }
          board2[row][column] = 'X';
        } else {
          if (board1[row][column] === 'S') {
            return finishBoard(n, board1, board2);
          }
          board1[row][column] = 'X';
        }
        await firePlayer(n===1? 2:1, board1, board2);
        resolve(ans);
      }
    });
  });
};

const game = async () => {

  console.log('Game Starting...');

  let pos1 = await playerPosition(1);
  let pos2 = await playerPosition(2);

  let board1 = board(8);
  let board2 = board(8);

  let index1P1 = board1[0].indexOf(pos1[0]);
  let index2P1 = board1[0].indexOf(pos1[3]);
  let index1P2 = board1[0].indexOf(pos2[0]);
  let index2P2 = board1[0].indexOf(pos2[3]);

  shipPositioning(board1, index1P1, pos1[1], index2P1, pos1[4]);
  shipPositioning(board2, index1P2, pos2[1], index2P2, pos2[4]);

  await firePlayer(1, board1, board2);
};

game();
