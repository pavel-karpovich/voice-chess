import * as path from 'path';
import * as subproc from 'child_process';

const stockfishPath = path.join(__dirname, '../node_modules/stockfish/src/stockfish.js');

export class StockfishEngine {
  private process: subproc.ChildProcess;
  onmessage: (str: string) => void;

  constructor() {
    const nodeJsPath = process.execPath;
    this.process = subproc.spawn(nodeJsPath, [stockfishPath], { stdio: "pipe" });
    this.process.stdout.on('data', (str) => this.onmessage(str.toString()));
    this.process.stderr.on('data', (str) => this.onmessage(str.toString()));
  }

  postMessage(str: string): void {
    this.process.stdin.write(str + '\n');
  }
}
