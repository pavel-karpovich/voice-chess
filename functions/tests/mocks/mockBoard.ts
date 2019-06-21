import { ChessSquareData, Captured } from "../../src/chess/chessboard";
import { ChessSide } from "../../src/chess/chessUtils";
import { MockProto } from './interface/mockProto';

const defaultPosFn = function (this: MockBoard, pos: string) { return this._pos; };

export class MockBoard extends MockProto {

  static pos: string;
  static rank: ChessSquareData[];
  static piecesByType: string[];
  static piecesBySide: ChessSquareData[];
  static captured: Captured;
  static availableCastlings: string[];
  static isCastling: boolean;
  static extract: boolean;
  static convFen: string;
  static enPassant: string;
  static castlingFen: string;
  static counterFen: number;
  static movesNumber: number;
  static moveSide: ChessSide;
  static isEnPassant: boolean;
  static isCapturing: boolean;

  static posFn: (pos: string) => string;

  static resetMockedData(): void {
    this.pos = null;
    this.rank = null;
    this.piecesByType = null;
    this.piecesBySide = null;
    this.captured = null;
    this.availableCastlings = null;
    this.isCastling = null;
    this.extract = null;
    this.convFen = null;
    this.enPassant = null;
    this.castlingFen = null;
    this.counterFen = null;
    this.movesNumber = null;
    this.moveSide = null;
    this.isEnPassant = null;
    this.isCapturing = null;

    this.posFn = defaultPosFn;
  }

  static instance: MockBoard;
  constructor() {
    super();
    MockBoard.instance = this;
  }

  _pos: string;
  _rank: ChessSquareData[];
  _piecesByType: string[];
  _piecesBySide: ChessSquareData[];
  _captured: Captured;
  _availableCastlings: string[];
  _isCastling: boolean;
  _extract: boolean;
  _convFen: string;
  _enPassant: string;
  _movesNumber: number;
  _moveSide: ChessSide;
  _isEnPassant: boolean;
  _isCapturing: boolean;
  _castlingFen: string;
  _counterFen: number;

  protected initMock(): void {
    this._pos = MockBoard.pos;
    this._rank = MockBoard.rank;
    this._piecesByType = MockBoard.piecesByType;
    this._piecesBySide = MockBoard.piecesBySide;
    this._captured = MockBoard.captured;
    this._availableCastlings = MockBoard.availableCastlings;
    this._isCastling = MockBoard.isCastling;
    this._extract = MockBoard.extract;
    this._convFen = MockBoard.convFen;
    this._enPassant = MockBoard.enPassant;
    this._castlingFen = MockBoard.castlingFen;
    this._counterFen = MockBoard.counterFen;
    this._movesNumber = MockBoard.movesNumber;
    this._moveSide = MockBoard.moveSide;
    this._isEnPassant = MockBoard.isEnPassant;
    this._isCapturing = MockBoard.isCapturing;

    this.pos = jest.fn(MockBoard.posFn);
  }

  pos: (pos: string) => string;
  rank = jest.fn(() => this._rank);
  allPiecesByType = jest.fn(() => this._piecesByType);
  allPiecesBySide = jest.fn(() => this._piecesBySide);
  capturedPieces = jest.fn(() => this._captured);
  getAvailableCastlingMoves = jest.fn(() => this._availableCastlings);
  isMoveCastling = jest.fn(() => this._isCastling);
  extract = jest.fn(() => this._extract);
  loadNonRecoverableInfo = jest.fn(() => {});
  convertToFen = jest.fn(() => this._convFen);
  isEnPassant = jest.fn(() => this._isEnPassant);
  isCapturing = jest.fn(() => this._isCapturing);
  get enPassant(): string {
    return this._enPassant;
  }
  get movesNumber(): number {
    return this._movesNumber;
  }
  get moveSide(): ChessSide {
    return this._moveSide;
  }
  get castlingFen(): string {
    return this._castlingFen;
  }
  get counterFen(): number {
    return this._counterFen;
  }
}
