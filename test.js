/* eslint-disable max-len */
const id = 0;
// const stockfish = require('stockfish');

// const engine = stockfish('node_modules/stockfish/src/stockfish.wasm');

const loadEngine = require('stockfish');
const Chess = require('./functions/src/chess');
const Ans = require('./functions/src/answer');
const {upFirst} = require('./functions/src/helpers');

const stockfish = loadEngine('node_modules/stockfish/src/stockfish.wasm');
console.log(stockfish);

let fenstring = 'rnbqkbnr/ppp1pppp/3p4/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 2';
let bestMove = null;
let on = null;
stockfish.onmessage = function(e) {
  if (typeof e !== 'string') return;
  if (e.startsWith('Fen')) {
    console.log(e);
    fenstring = e.slice(5);
    console.log(fenstring);
  } else if (e.startsWith('Legal uci moves')) {
    const moves = e.slice(17).split(' ');
    console.log(moves);
    console.log(e);
  } else if (e.startsWith('bestmove')) {
    bestMove = e.slice(9, 13);
    stockfish.postMessage(`position fen ${fenstring} moves ${bestMove}`);
    console.log('|' + bestMove + '|');
    console.log('2');
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

/**
 * Send
 */
async function send() {
  return new Promise((resolve) => {
    on = (e) => resolve(e);
    console.log('1');
    stockfish.postMessage('go ponder depth 8 movetime 10000');
  });
}

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
