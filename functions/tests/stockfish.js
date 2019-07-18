const path = require('path');
const util = require('util');
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
