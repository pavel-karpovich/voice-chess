const path = require('path');
const subproc = require('child_process');
console.log(process.execPath);
const nodeJsPath = process.execPath;
const stockfishPath = path.join(__dirname, '../node_modules/stockfish/src/stockfish.js');
const engine = subproc.spawn(nodeJsPath, [stockfishPath], {stdio: "pipe"});
const worker = {};
worker.postMessage = (str) => engine.stdin.write(str + '\n');
engine.stdout.on('data', (str) => worker.onmessage(str.toString()));
engine.stderr.on('data', (str) => worker.onmessage(str.toString()));
engine.on('error', (err) => { throw err; });

worker.onmessage = (str) => console.log(str);
worker.postMessage('isready');
worker.postMessage('ucinewgamed');
worker.postMessage('position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
worker.postMessage('d');

/*const load_engine = require('../node_modules/stockfish/load_engine.js');
const eng = load_engine();
console.log(eng);
eng.send('isready', (msg) => console.log(msg));
eng.send('ucinewgame', (msg) => console.log(msg));
eng.send('position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', (msg) => console.log(msg));
eng.send('d', (msg) => console.log(msg));
console.log(eng.get_cue_len());
*/