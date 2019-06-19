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
  static rookMove: string;
  static extract: boolean;
  static convFen: string;
  static enPassant: string;
  static cstFen: string;
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
    this.rookMove = null;
    this.extract = null;
    this.convFen = null;
    this.enPassant = null;
    this.cstFen = null;
    this.movesNumber = null;
    this.moveSide = null;
    this.isEnPassant = null;
    this.isCapturing = null;

    this.posFn = defaultPosFn;
  }
  
  _pos: string;
  _rank: ChessSquareData[];
  _piecesByType: string[];
  _piecesBySide: ChessSquareData[];
  _captured: Captured;
  _availableCastlings: string[];
  _isCastling: boolean;
  _rookMove: string;
  _extract: boolean;
  _convFen: string;
  _enPassant: string;
  _cstFen: string;
  _movesNumber: number;
  _moveSide: ChessSide;
  _isEnPassant: boolean;
  _isCapturing: boolean;

  protected initMock(): void {
    this._pos = MockBoard.pos;
    this._rank = MockBoard.rank;
    this._piecesByType = MockBoard.piecesByType;
    this._piecesBySide = MockBoard.piecesBySide;
    this._captured = MockBoard.captured;
    this._availableCastlings = MockBoard.availableCastlings;
    this._isCastling = MockBoard.isCastling;
    this._rookMove = MockBoard.rookMove;
    this._extract = MockBoard.extract;
    this._convFen = MockBoard.convFen;
    this._enPassant = MockBoard.enPassant;
    this._cstFen = MockBoard.cstFen;
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
  rookMoveForCastlingMove = jest.fn(() => this._rookMove);
  extract = jest.fn(() => this._extract);
  loadCorrectCastlingFen = jest.fn(() => void 0);
  convertToFen = jest.fn(() => this._convFen);
  isEnPassant = jest.fn(() => this._isEnPassant);
  isCapturing = jest.fn(() => this._isCapturing);
  get enPassant(): string {
    return this._enPassant;
  }
  get cstFen(): string {
    return this._cstFen;
  }
  get movesNumber(): number {
    return this._movesNumber;
  }
  get moveSide(): ChessSide {
    return this._moveSide;
  }
}
