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

  static instance: Mochess;
  constructor() {
    super();
    Mochess.instance = this;
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
  updateGameState = jest.fn(async() => {});
  isPromotion = jest.fn(() => this._isPromo);
  isMoveLegal = jest.fn(() => this._isLegal);
  bestMove = jest.fn(async() => this._bestMove);
  move = jest.fn(async() => {});
  moveAuto = jest.fn(async() => {});
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
