/* eslint-disable max-len */


const util = require('util');
const loadEngine = require('./functions/node_modules/stockfish');
const {Chess} = require('./functions/lib/chess');
const {ChessBoard} = require('./functions/lib/chessboard');
const {Answer} = require('./functions/lib/answer');
const {upFirst} = require('./functions/lib/helpers');

const stockfish = loadEngine('./functions/node_modules/stockfish/src/stockfish.wasm');


let fenstring = '4k3/8/2Q5/4p1p1/p2P4/1P3N2/3K4/8 w KQkq - 0 1';
let bestMove = null;
let on = null;

stockfish.onmessage = function(e) {
  if (typeof e !== 'string') return;
  console.log(e);
  if (e.startsWith('Fen')) {
    console.log(e);
    fenstring = e.slice(5);
    console.log(fenstring);
  } else if (e.startsWith('Checkers')) {
    checkers = e.slice(10).split(' ');
    checkers.pop();
    console.log(checkers);
  } else if (e.startsWith('Legal uci moves')) {
    const moves = e.slice(17).split(' ');
    moves.pop();
    console.log(moves);
    console.log(e);
    if (on) {
      on(e);
    }
  } else if (e.startsWith('bestmove')) {
    console.log(e);
    bestMove = e.slice(9, 14);
    console.log(`position fen ${fenstring} moves ${bestMove}`);
    stockfish.postMessage(`position fen ${fenstring} moves ${bestMove}`);
    stockfish.postMessage('d');
  }
};
stockfish.postMessage('ucinewgame');
stockfish.postMessage('isready');
stockfish.postMessage(`position fen ${fenstring}`);

/**
 * Send
 */
async function moveAuto(depth) {
  return new Promise((resolve) => {
    on = (e) => resolve(e);
    stockfish.postMessage(`go depth ${depth} movetime 2000`);
  });
}


function testAnswers() {
  Ans.setLanguage('en');
  const board = Chess.parseBoard(fenstring);
  let longString = '<speak>\n';
  for (let i = 0; i < board.length; ++i) {
    if (board[i].every((el) => el.val === null)) {
      const emptyRowString = upFirst(Ans.emptyRow(i + 1));
      longString += emptyRowString + '.\n';
    } else {
      longString += Ans.nRow(i + 1) + ': ';
      for (let j = 0; j < board[i].length; ++j) {
        const cell = board[i][j];
        if (cell.val !== null) {
          longString += Ans.coloredPieceOnPosition(cell.val, cell.pos) + ', ';
        }
      }
      longString = longString.slice(0, -2) + '.\n';
    }
  }
  longString += '</speak>';
  console.log(longString.length);
}

async function move(pos) {
  return new Promise((resolve) => {
    on = (e) => resolve(e);
    stockfish.postMessage(`position fen ${fenstring} moves ${pos}`);
    stockfish.postMessage('d');
  });
}

let moveNumber = 1;
async function nextMove() {
  console.log(`Move ${moveNumber++}`);
  await move('b7b8q');
  console.log(`Move ${moveNumber++}`);
  await moveAuto(2);
  console.log(`Move ${moveNumber++}`);
  await moveAuto(1);
  console.log(`Move ${moveNumber++}`);
  await moveAuto(10);
  // await nextMove();
}

// nextMove();

const chess = new Chess(fenstring, 2);
Answer.setLanguage('ru');

async function game() {
  await chess.updateGameState();
  let n = 0;
  let bulk = null;
  do {
    bulk = chess.getBulkOfMoves(n);
    console.log(util.inspect(bulk, { depth: 5 }));
    console.log(Answer.listMoves(bulk.pieces));
    n = bulk.next;
  } while(!bulk.end);
}

game();