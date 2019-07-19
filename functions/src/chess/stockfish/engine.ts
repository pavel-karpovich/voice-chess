import * as path from 'path';
import * as subproc from 'child_process';

const stockfishPath = path.join(__dirname, '../../../node_modules/stockfish/src/stockfish.js');
console.log(stockfishPath);

export class StockfishEngine {
  private process: subproc.ChildProcess;
  onmessage: (str: string) => void;

  static instance: subproc.ChildProcess;

  constructor() {
    const nodeJsPath = process.execPath;
    this.process = subproc.spawn(nodeJsPath, [stockfishPath], { stdio: 'pipe' });
    const self = this;
    function echo(data: Uint8Array) {
      let str;
      if (self.onmessage) {
        str = data.toString();
        if (str.slice(-1) === '\n') {
          str = str.slice(0, -1);
        }
        self.onmessage(str);
      } else {
        console.error('onmessage handler must be defined.');
      }
    }
    this.process.stdout.on('data', echo);
    this.process.stderr.on('data', echo);
    this.process.on('error', err => {
      throw err;
    });
    // if (StockfishEngine.instance) {
    //   StockfishEngine.instance.kill();
    //   StockfishEngine.instance = null;
    // }
    StockfishEngine.instance = this.process;
  }

  postMessage(str: string): void {
    this.process.stdin.write(str + '\n');
  }
}
