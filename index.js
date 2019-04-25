/* eslint-disable max-len */
const id = 0;
// const stockfish = require('stockfish');

// const engine = stockfish('node_modules/stockfish/src/stockfish.wasm');
const loadEngine = require('stockfish');

const stockfish = loadEngine('node_modules/stockfish/src/stockfish.wasm');
console.log(stockfish);

let fenstring = 'rnbqkbnr/ppp1pppp/3p4/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 2';
let bestMove = null;
let on = null;
stockfish.onmessage = function(e) {
  if (e.startsWith('Fen')) {
    console.log(e);
    fenstring = e.slice(5);
    console.log(fenstring);
  } else if (e.startsWith('bestmove')) {
    console.log(e);
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
send().then((e) => {
  console.log(e);
  const enemyMove = e.slice(9, 13);
  const enemyFrom = enemyMove.slice(0, 2);
  const enemyTo = enemyMove.slice(2);
  console.log(`I would move from ${enemyFrom} to ${enemyTo}!`);
  stockfish.postMessage('d');
  console.log('3');
  return true;
}).catch(() => console.log('Error'));


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

// stockfish.send('uci', () => {
//   stockfish.send('isready');
//   stockfish.send('d', (str) => {
//     console.log('1 ' + str);
//     stockfish.send('eval', (str) => {
//       console.log('2 ' + str);

//       stockfish.send('go depth 7', (str) => {
//         console.log('3 Stockfish says best move: ' + str.match(/bestmove (\S+)/)[1]);
//         stockfish.send('quit');
//       }, (str) => {
//         console.log('thinking: ' + str);
//       });
//     });
//   });
// });
