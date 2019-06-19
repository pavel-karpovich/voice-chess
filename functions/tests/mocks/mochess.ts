import { MockProto } from "./interface/mockProto";
import { ChessGameState } from "../../src/chess/chess";

const defaultInitFen = 'init fen';
const defaultGameState = ChessGameState.OK;

export class Mochess extends MockProto {

  static initFen: string;
  static isPromo: boolean;
  static isLegal: boolean;
  static bestMove: string;
  static state: ChessGameState;
  static moves: string[];
  static fen: string;
  static enemyMove: string;

  static resetMockedData(): void {
    this.initFen = defaultInitFen;
    this.isPromo = undefined;
    this.isLegal = undefined;
    this.bestMove = undefined;
    this.state = defaultGameState;
    this.moves = undefined;
    this.fen = undefined;
    this.enemyMove = undefined;
  }

  constructor(fen: string) {
    super();
    if (fen) this._fen = fen;
  }

  _isPromo: boolean;
  _isLegal: boolean;
  _bestMove: string;
  _state: ChessGameState;
  _moves: string[];
  _fen: string;
  _enemyMove: string;
  
  protected initMock(): void {
    this._isPromo = Mochess.isPromo;
    this._isLegal = Mochess.isLegal;
    this._bestMove = Mochess.bestMove;
    this._state = Mochess.state;
    this._moves = Mochess.moves;
    this._fen = Mochess.fen;
    this._enemyMove = Mochess.enemyMove;
  }

  static get initialFen(): string {
    return this.initFen;
  }
  async updateGameState(): Promise<void> {
    return;
  }
  isPromotion(move: string): boolean {
    return this._isPromo;
  }
  isMoveLegal(move: string): boolean {
    return this._isLegal;
  }
  async bestMove(): Promise<string> {
    return this._bestMove;
  }
  async move(move: string): Promise<void> {
    return;
  }
  async moveAuto(): Promise<void> {
    return;
  }
  get currentGameState(): ChessGameState {
    return this._state;
  }
  get legalMoves(): string[] {
    return this._moves;
  }
  get fenstring(): string {
    return this._fen;
  }
  set fenstring(fen: string) {
    this._fen = fen;
  }
  get enemyMove(): string {
    return this._enemyMove;
  }
}
