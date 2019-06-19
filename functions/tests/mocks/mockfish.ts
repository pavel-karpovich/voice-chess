import { MockProto } from "./interface/mockProto";

interface MockfishOptions {
  ponder?: boolean;
  slowMover?: number;
  skillLevel?: number;
  skillLevelMaximumError?: number;
  skillLevelPropability?: number;
}

const defaultRetFen = 'rn2kb1r/p1p2p1p/bp1p2p1/1B2p3/P3P2q/1PNn1P1N/2PQ2PP/R1B1K2R w KQkq - 1 2';
const defaultRetCheckers = ['d3', 'h4'];
const defaultMoves = ['e1d1', 'e1f1', 'e1e2', 'b7b8q'];
const defaultBestMove = 'e1d1';

export class Mockfish extends MockProto {

  static retFen = defaultRetFen;
  static retCheckers = defaultRetCheckers;
  static retMoves = defaultMoves;
  static retBestMove = defaultBestMove;

  static resetMockedData(): void {
    this.retFen = defaultRetFen;
    this.retCheckers = defaultRetCheckers;
    this.retMoves = defaultMoves;
    this.retBestMove = defaultBestMove;
  }

  _retFen: string;
  _retCheckers: string[];
  _retMoves: string[];
  _retBestMove: string;
  
  protected initMock(): void {
    this._retFen = Mockfish.retFen;
    this._retCheckers = Mockfish.retCheckers;
    this._retMoves = Mockfish.retMoves;
    this._retBestMove = Mockfish.retBestMove;
  }

  options: MockfishOptions;
  fen: string;
  moves: string[];
  history: string[];
  onmessage: (e: string) => void;

  static instance: Mockfish;
  constructor() {
    super();
    this.options = {};
    this.moves = [];
    this.history = [];
    Mockfish.instance = this;
  }

  postMessage(message: string): void {
    this.history.push(message);
    if (message.startsWith('setoption')) {
      this.onSetOption(message);
    } else if (message.startsWith('position')) {
      this.onPosition(message);
    } else if (message === 'd') {
      this.onDisplay();
    } else if (message.startsWith('go depth')) {
      this.onGoInDepth();
    }
  }
  
  private onSetOption(msg: string): void {
    const pattern = /^setoption name (?<name>.+) value (?<value>.+)$/i;
    const match = pattern.exec(msg);
    switch (match.groups.name.toLowerCase()) {
      case 'ponder':
        this.options.ponder = (match.groups.value === 'true');
        break;
      case 'slow mover':
        this.options.slowMover = Number(match.groups.value);
        break;
      case 'skill level':
        this.options.skillLevel = Number(match.groups.value);
        break;
      case 'skill level maximum error':
        this.options.skillLevelMaximumError = Number(match.groups.value);
        break;
      case 'skill level probability':
        this.options.skillLevelPropability = Number(match.groups.value);
        break;
      default:
        break;
    }
  }

  private onPosition(msg: string): void {
    const fen = '(?<fen>(?:[1-8kqbnrp]{1,8}\/){7}[1-8kqbnrp]{1,8} [wb] (?:-|[kq]{1,4}) (?:-|[a-h][1-8]) \\d{1,2} \\d{1,2})';
    const pattern = new RegExp(`^position fen ${fen}(?: moves (?<move>(?:[a-h][1-8]){2}[qrnb]?))?$`, 'i');
    const match = pattern.exec(msg);
    this.fen = match.groups.fen;
    if (match.groups.move) {
      this.moves.push(match.groups.move);
    }
  }

  private onDisplay(): void {
    if (this.onmessage) {
      setImmediate(() => this.onmessage(`Fen: ${Mockfish.retFen}`));
      const checkersStr = Mockfish.retCheckers.reduce((str, val) => str += val + ' ', '');
      setImmediate(() => this.onmessage(`Checkers: ${checkersStr}`));
      const movesStr = Mockfish.retMoves.reduce((str, val) => str += val + ' ', '');
      setImmediate(() => this.onmessage(`Legal uci moves: ${movesStr}`));
    }
  }

  private onGoInDepth(): void {
    if (this.onmessage) {
      setImmediate(() => this.onmessage(`bestmove ${Mockfish.retBestMove} ponder a6b5`));
    }
  }

} 
