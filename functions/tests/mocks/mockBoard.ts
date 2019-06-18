import { ChessSquareData, Captured } from "../../src/chess/chessboard";
import { ChessSide } from "../../src/chess/chessUtils";
import { MockProto } from './interface/mockProto';

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
  }

  static instance: MockBoard;
  constructor() {
    super();
    MockBoard.instance = this;
    this.initMock();
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
  }

  pos(pos: string): string {
    return this._pos;
  }
  rank(i: number): ChessSquareData[] {
    return this._rank;
  }
  allPiecesByType(piece: string): string[] {
    return this._piecesByType;
  }
  allPiecesBySide(side: ChessSide): ChessSquareData[] {
    return this._piecesBySide;
  }
  capturedPieces(): Captured {
    return this._captured;
  }
  getAvailableCastlingMoves(side: ChessSide): string[] {
    return this._availableCastlings;
  }
  isMoveCastling(move: string): boolean {
    return this._isCastling;
  }
  rookMoveForCastlingMove(move: string): string {
    return this._rookMove;
  }
  extract(move: string, capt?: string, enPass?: string, cstl?: string): boolean {
    return this._extract;
  }
  loadCorrectCastlingFen(cstFen: string): void {
    return;
  }
  convertToFen(): string {
    return this._convFen;
  }
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
