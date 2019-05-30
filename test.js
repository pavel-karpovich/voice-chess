/* eslint-disable max-len */

const readline = require('readline');

const loadEngine = require('./functions/node_modules/stockfish');
const Chess = require('./functions/lib/chess');
const Ans = require('./functions/lib/answer');
const {upFirst} = require('./functions/lib/helpers');

const stockfish = loadEngine('./functions/node_modules/stockfish/src/stockfish.wasm');


let fenstring = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
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
  } else if (e.startsWith('bestmove')) {
    bestMove = e.slice(9, 14);
    console.log(`position fen ${fenstring} moves ${bestMove}`);
    stockfish.postMessage(`position fen ${fenstring} moves ${bestMove}`);
    stockfish.postMessage('d');
    if (on) {
      on(e);
    }
    // stockfish.postMessage('d');
  }
};
stockfish.postMessage('ucinewgame');
stockfish.postMessage('isready');
stockfish.postMessage(`position fen ${fenstring}`);
stockfish.postMessage('d');
stockfish.postMessage(`go depth 2 movetime 2000`);

/**
 * Send
 */
async function makeMove(depth) {
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

let moveNumber = 1;
async function nextMove() {
  console.log(`Move ${moveNumber++}`);
  await makeMove(1);
  await makeMove(10);
  await nextMove();
}

nextMove();