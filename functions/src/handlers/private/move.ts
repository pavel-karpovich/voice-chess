import { Chess, ChessGameState } from "../../chess/chess";
import { HandlerBase } from "../struct/handlerBase";
import { Answer as Ans } from '../../locales/answer';
import { Ask } from "../../locales/ask";
import { ChessBoard } from "../../chess/chessboard";
import { pause, gaussianRandom } from "../../support/helpers";
import { ChessSide, getSide, CastlingType } from "../../chess/chessUtils";
import { Handlers } from "../public";

export class MoveHandlers extends HandlerBase {

  static async prepareToMove(move: string, chess?: Chess): Promise<void> {
    if (!chess) {
      const fenstring = this.long.fen;
      const difficulty = this.long.options.difficulty;
      chess = new Chess(fenstring, difficulty);
    }
    await chess.updateGameState();
    if (chess.isPromotion(move)) {
      const from = move.slice(0, 2);
      const to = move.slice(2, 4);
      this.speak(Ans.promotion(from, to));
      this.speak(Ask.howToPromote());
      this.contexts.set('ask-to-promotion', 1, { move });
      const correctCtx = this.contexts.get('correct-last-move');
      if (correctCtx) {
        this.contexts.set('correct-last-move', 1);
      }
      return;
    }
    await this.moveByPlayer(move, chess);
    await this.moveByAI(chess);
  }

  private static dropGame(): void {
    this.contexts.set('ask-to-new-game', 1);
    this.long.fen = null;
    this.contexts.drop('game');
  }

  private static async moveByPlayer(move: string, chess?: Chess, prologue?: string): Promise<void> {
    let fenstring = this.long.fen;
    const difficulty = this.long.options.difficulty;
    if (!chess) {
      chess = new Chess(fenstring, difficulty);
    }
    const correctCtx = this.contexts.get('correct-last-move');
    const hist = this.long.history;
    if (correctCtx) {
      const board = new ChessBoard(fenstring);
      const lastAIMove = hist.pop();
      const lastPlMove = hist.pop();
      board.extract(lastAIMove.m.slice(1), lastAIMove.b, lastAIMove.e, lastAIMove.c);
      board.extract(lastPlMove.m.slice(1), lastPlMove.b, lastPlMove.e, lastPlMove.c);
      const cstFen = this.long.cstFen;
      board.loadCorrectCastlingFen(cstFen);
      fenstring = board.convertToFen();
      chess.fenstring = fenstring;
    }
    const from = move.slice(0, 2);
    const to = move.slice(2, 4);
    const board = new ChessBoard(chess.fenstring);
    this.long.cstFen = board.cstFen;
    const piece = board.pos(from);
    const beatedPiece = board.pos(to);
    await chess.move(move);
    let answer = '';
    if (prologue) {
      answer += prologue + pause(1) + '\n';
    }
    const isEnPassant = board.enPassant === to;
    const cast = board.isMoveCastling(move);
    let rookMove = null;
    let enPassPawn = null;
    if (cast) {
      rookMove = board.rookMoveForCastlingMove(move);
      const rFrom = rookMove.slice(0, 2);
      const rTo = rookMove.slice(2, 4);
      answer += Ans.castlingByPlayer(from, to, rFrom, rTo);
    } else if (isEnPassant) {
      enPassPawn = hist[hist.length - 1].m.slice(3, 5);
      answer += Ans.enPassantPlayer(from, to, enPassPawn);
    } else {
      answer += Ans.playerMove(from, to, piece);
      if (move.length === 5) {
        const promotionPieceCode = move[4];
        answer += ' ' + Ans.moveWithPromotion(promotionPieceCode);
      }
    }
    let historyItem;
    if (beatedPiece) {
      historyItem = { m: piece + move, b: beatedPiece };
      answer += Ans.playerEat(beatedPiece);
    } else if (cast) {
      historyItem = { m: piece + move, c: rookMove };
    } else if (isEnPassant) {
      historyItem = { m: piece + move, e: enPassPawn };
    } else {
      historyItem = { m: piece + move };
    }
    hist.push(historyItem);
    this.long.fen = chess.fenstring;
    switch (chess.currentGameState) {
      case ChessGameState.CHECKMATE:
        this.speak(answer + ' \n' + Ans.youWin());
        this.speak(Ask.askToNewGame());
        this.dropGame();
        return;
      case ChessGameState.STALEMATE:
        this.speak(`${answer} \n${Ans.stalemateToEnemy()} \n${Ans.draw()}`);
        this.speak(Ask.askToNewGame());
        this.dropGame();
        return;
      case ChessGameState.FIFTYMOVEDRAW:
        this.speak(`${answer} \n${Ans.fiftymove()} \n${Ans.draw()}`);
        this.speak(Ask.askToNewGame());
        this.dropGame();
        return;
      case ChessGameState.CHECK:
        answer += '\n' + Ans.checkToEnemy();
        break;
      default: break;
    }
    this.speak(answer);
  }

  private static async moveByAI(chess?: Chess): Promise<void> {
    if (!chess) {
      const fenstring = this.long.fen;
      const difficulty = this.long.options.difficulty;
      chess = new Chess(fenstring, difficulty);
    }
    const hist = this.long.history;
    const boardBeforeMove = new ChessBoard(chess.fenstring);
    await chess.moveAuto();
    const enemyFrom = chess.enemyMove.slice(0, 2);
    const enemyTo = chess.enemyMove.slice(2, 4);
    const beatedPiece = boardBeforeMove.pos(enemyTo);
    const boardAfterMove = new ChessBoard(chess.fenstring);
    const enemyPiece = boardAfterMove.pos(enemyTo);
    let answer = '';
    const isEnPassant = boardBeforeMove.enPassant === enemyTo;
    const cast = boardBeforeMove.isMoveCastling(chess.enemyMove);
    let rookMove = null;
    let enPassPawn = null;
    if (cast) {
      rookMove = boardBeforeMove.rookMoveForCastlingMove(chess.enemyMove);
      const rFrom = rookMove.slice(0, 2);
      const rTo = rookMove.slice(2, 4);
      answer += Ans.castlingByOpponent(enemyFrom, enemyTo, rFrom, rTo);
    } else if (isEnPassant) {
      enPassPawn = hist[hist.length - 1].m.slice(3, 5);
      answer += Ans.enPassantEnemy(enemyFrom, enemyTo, enPassPawn);
    } else {
      if (chess.enemyMove.length === 5) {
        answer = Ans.enemyMove(enemyFrom, enemyTo, 'p');
        answer += ' ' + Ans.moveWithPromotion(enemyPiece);
      } else {
        answer = Ans.enemyMove(enemyFrom, enemyTo, enemyPiece);
      }
    }
    let historyItem;
    if (beatedPiece) {
      historyItem = { m: enemyPiece + chess.enemyMove, b: beatedPiece };
      answer += Ans.enemyEat(beatedPiece);
    } else if (cast) {
      historyItem = { m: enemyPiece + chess.enemyMove, c: rookMove };
    } else if (isEnPassant) {
      historyItem = { m: enemyPiece + chess.enemyMove, e: enPassPawn };
    } else {
      historyItem = { m: enemyPiece + chess.enemyMove };
    }
    hist.push(historyItem);
    switch (chess.currentGameState) {
      case ChessGameState.CHECKMATE:
        answer += `${answer} \n${Ans.checkmateToPlayer()} \n`;
        answer += `${Ans.youLose()} \n${Ask.askToNewGame()}`;
        this.speak(answer);
        this.dropGame();
        return;
      case ChessGameState.STALEMATE:
        answer += ` \n${Ans.stalemateToPlayer()} \n`;
        answer += `${Ans.draw()} \n${Ask.askToNewGame()}`;
        this.speak(answer);
        this.dropGame();
        return;
      case ChessGameState.FIFTYMOVEDRAW:
        answer += ` \n${Ans.fiftymove()} \n`;
        answer += `${Ans.draw()} \n${Ask.askToNewGame()}`;
        this.speak(answer);
        this.dropGame();
        return;
      case ChessGameState.CHECK:
        answer += '\n' + Ans.checkToPlayer() + pause(1);
        break;
      default: break;
    }
    const askYouStr = Ask.nowYouNeedToMove();
    this.speak(`${pause(2)}${answer}\n${askYouStr}`);
    this.long.fen = chess.fenstring;
  }

  private static async playerMoveByAI(chess?: Chess): Promise<void> {
    if (!chess) {
      const fenstring = this.long.fen;
      const difficulty = this.long.options.difficulty;
      chess = new Chess(fenstring, difficulty);
    }
    const answer = Ans.playerAutoMove();
    const move = await chess.bestMove();
    await this.moveByPlayer(move, chess, answer);
  }

  static async acceptMove(): Promise<void> {
    const move = this.contexts.get('confirm-move').parameters.move as string;
    await this.prepareToMove(move);
  }
  
  private static askOrRemind(): void {
    const correctCtx = this.contexts.get('correct-last-move');
    if (correctCtx) {
      this.speak(Ask.correctFails());
      return;
    }
    const fiftyFifty = Math.random();
    if (fiftyFifty < 0.65) {
      this.speak(Ask.askToMoveAgain());
    } else {
      this.speak(Ask.askToRemindBoard());
      this.contexts.set('turn-showboard', 1);
    }
  }

  static async turn(from: string, to: string, piece?: string): Promise<void> {
    from = from.toLowerCase();
    to = to.toLowerCase();
    const move = from + to;
    let fenstring = this.long.fen;
    const correctCtx = this.contexts.get('correct-last-move');
    if (correctCtx) {
      const hist = this.long.history;
      const board = new ChessBoard(fenstring);
      const lastAIMove = hist[hist.length - 1];
      const lastPlMove = hist[hist.length - 2];
      board.extract(lastAIMove.m.slice(1), lastAIMove.b, lastAIMove.e, lastAIMove.c);
      board.extract(lastPlMove.m.slice(1), lastPlMove.b, lastPlMove.e, lastPlMove.c);
      const cstFen = this.long.cstFen;
      board.loadCorrectCastlingFen(cstFen);
      fenstring = board.convertToFen();
    }
    const difficulty = this.long.options.difficulty;
    const playerSide = this.long.side;
    const chess = new Chess(fenstring, difficulty);
    const board = new ChessBoard(chess.fenstring);
    if (board.moveSide !== playerSide) {
      const msg = 'The player and server sides are messed.';
      console.log(`ERROR: ${msg}`);
      this.speak(Ans.error(msg));
      this.speak(Ask.tryAgainOrLater());
      return;
    }
    const actualPiece = board.pos(from);
    let piecesMatch = true;
    if (!piece && !actualPiece) {
      this.speak(Ans.squareIsEmpty(from));
      this.askOrRemind();
      return;
    } else if (piece && !actualPiece) {
      this.speak(Ans.squareIsEmpty(from, piece));
      this.askOrRemind();
      return;
    } else if (!piece && actualPiece) {
      piece = actualPiece;
    } else if (piece !== actualPiece) {
      piecesMatch = false;
    }
    if (getSide(actualPiece) !== playerSide) {
      this.speak(Ans.wrongSide(playerSide, from, actualPiece));
      this.askOrRemind();
      return;
    }
    await chess.updateGameState();
    const isLegal = chess.isMoveLegal(move);
    if (!isLegal) {
      let illegal = Ans.illegalMove(from, to, piece);
      if (chess.currentGameState === ChessGameState.CHECK) {
        illegal = `${Ans.checkToPlayer()}${pause(2)}\n${illegal}`;
      }
      this.speak(illegal);
      this.askOrRemind();
      return;
    }
    if (!piecesMatch) {
      this.speak(Ans.piecesDontMatch(piece, actualPiece, from));
      this.speak(Ask.moveWithoutPiecesMatch(actualPiece, piece, from, to));
      this.contexts.set('confirm-move', 1, { move });
      if (correctCtx) {
        this.contexts.set('correct-last-move', 1);
      }
      return;
    }
    const needConfirm = this.long.options.confirm;
    if (needConfirm) {
      this.speak(Ask.askToConfirm(from, to, actualPiece));
      this.contexts.set('confirm-move', 1, { move });
      if (correctCtx) {
        this.contexts.set('correct-last-move', 1);
      }
      return;
    }
    await this.prepareToMove(move, chess);
  }

  static async promotion(toPiece: string): Promise<void> {
    const promContext = this.contexts.get('ask-to-promotion');
    let move = promContext.parameters.move as string;
    move += toPiece;
    await this.moveByPlayer(move);
    await this.moveByAI();
  }

  static async chooseSide(side: ChessSide): Promise<void> {
    this.long.side = side;
    if (side === ChessSide.WHITE) {
      this.speak(Ans.whiteSide());
      this.speak(Ask.askToMove());
    } else {
      this.speak(Ans.blackSide());
      const fenstring = this.long.fen;
      const difficulty = this.long.options.difficulty;
      const chess = new Chess(fenstring, difficulty);
      await chess.moveAuto();
      this.long.fen = chess.fenstring;
      const enemyFrom = chess.enemyMove.slice(0, 2);
      const enemyTo = chess.enemyMove.slice(2, 4);
      const board = new ChessBoard(chess.fenstring);
      const enemyPiece = board.pos(enemyTo);
      const historyItem = { m: enemyPiece + chess.enemyMove };
      this.long.history.push(historyItem);
      const enemyStr = Ans.enemyMove(enemyFrom, enemyTo, enemyPiece);
      const askYouStr = Ask.nowYouNeedToMove();
      this.speak(enemyStr + '\n' + askYouStr);
    }
  }

  static async moveAuto(): Promise<void> {
    const fenstring = this.long.fen;
    const difficulty = this.long.options.difficulty;
    const chess = new Chess(fenstring, difficulty);
    await this.playerMoveByAI(chess);
    await this.moveByAI(chess);
  }

  static async castling(): Promise<void> {
    const fenstring = this.long.fen;
    const board = new ChessBoard(fenstring);
    const playerSide = this.long.side;
    const castlings = board.getAvailableCastlingMoves(playerSide);
    if (castlings.length === 0) {
      this.speak(Ans.cantCastling());
      this.askOrRemind();
      return;
    }
    const kingPos = castlings[0].slice(0, 2);
    const to1 = castlings[0].slice(2, 4);
    if (castlings.length === 2) {
      const to2 = castlings[1].slice(2, 4);
      this.speak(Ans.twoTypesOfCastling(kingPos, to1, to2));
      this.speak(Ask.chooseCastling());
      this.contexts.set('choose-castling', 1);
      return;
    }
    const needConfirm = this.long.options.confirm;
    if (needConfirm) {
      const rockMove = board.rookMoveForCastlingMove(castlings[0]);
      const rFrom = rockMove.slice(0, 2);
      const rTo = rockMove.slice(2, 4);
      this.speak(Ask.askToConfirmCastling(kingPos, to1, rFrom, rTo));
      this.contexts.set('confirm-move', 1, { move: castlings[0] });
      return;
    }
    await this.moveByPlayer(castlings[0]);
    await this.moveByAI();
  }
  
  static correct(): void {
    const hist = this.long.history;
    if (hist.length < 2) {
      this.speak(Ans.noMoveToCorrect());
      this.speak(Ask.waitMove());
      return;
    }
    const lastMove = hist[hist.length - 2];
    const from = lastMove.m.slice(1, 3);
    const to = lastMove.m.slice(3, 5);
    const piece = lastMove.m[0];
    this.speak(Ask.moveToCorrect(from, to, piece));
    this.contexts.set('correct-last-move', 1);
  }

  static async chooseCastling(cast?: CastlingType, piece?: string, cell?: string): Promise<void> {
    const fenstring = this.long.fen;
    const board = new ChessBoard(fenstring);
    const playerSide = this.long.side;
    const castlings = board.getAvailableCastlingMoves(playerSide);
    const to1 = castlings[0].slice(2, 4);
    const to2 = castlings[1].slice(2, 4);
    const rockMove1 = board.rookMoveForCastlingMove(castlings[0]);
    const rockFrom1 = rockMove1.slice(0, 2);
    const rockTo1 = rockMove1.slice(2, 4);
    const rockMove2 = board.rookMoveForCastlingMove(castlings[1]);
    const rockFrom2 = rockMove2.slice(0, 2);
    const rockTo2 = rockMove2.slice(2, 4);
    let playerMove;
    if (
      cast === CastlingType.KINGSIDE ||
      piece === 'k' ||
      (cell === to1 || cell === rockFrom1 || cell === rockTo1)
    ) {
      playerMove = castlings[0];
    } else if (
      cast === CastlingType.QUEENSIDE ||
      piece === 'q' ||
      (cell === to2 || cell === rockFrom2 || cell === rockTo2)
    ) {
      playerMove = castlings[1];
    } else {
      Handlers.fallback();
      return;
    }
    const needConfirm = this.long.options.confirm;
    if (needConfirm) {
      const kingPos = playerMove.slice(0, 2);
      if (playerMove === castlings[0]) {
        this.speak(Ask.askToConfirmCastling(kingPos, to1, rockFrom1, rockTo1));
      } else {
        this.speak(Ask.askToConfirmCastling(kingPos, to2, rockFrom2, rockTo2));
      }
      this.contexts.set('confirm-move', 1, { move: playerMove });
      return;
    }
    await this.moveByPlayer(playerMove);
    await this.moveByAI();
  }

  static async acceptAdvice(): Promise<void> {
    const needConfirm = this.long.options.confirm;
    const advCtx = this.contexts.get('advice-made');
    const move = advCtx.parameters.move as string;
    if (needConfirm) {
      const from = move.slice(0, 2);
      const to = move.slice(2, 4);
      const fenstring = this.long.fen;
      const board = new ChessBoard(fenstring);
      const piece = board.pos(from);
      this.speak(Ask.askToConfirm(from, to, piece));
      this.contexts.set('confirm-move', 1, { move });
      return;
    }
    await this.prepareToMove(move);
  }
  
  static async advice(): Promise<void> {
    const fenstring = this.long.fen;
    const difficulty = this.long.options.difficulty;
    const delta = 6;
    const min = difficulty - delta;
    const max = difficulty + delta;
    const rndDif = (Math.floor((max - min) * gaussianRandom()) + min) | 0;
    const chess = new Chess(fenstring, rndDif);
    const randomChance = 0.2;
    const rnd = Math.random();
    let advisedMove = null;
    if (rnd < randomChance) {
      await chess.updateGameState();
      const rndMoveIndex = Math.floor(Math.random() * chess.legalMoves.length);
      advisedMove = chess.legalMoves[rndMoveIndex];
    } else {
      advisedMove = await chess.bestMove();
    }
    const from = advisedMove.slice(0, 2);
    const to = advisedMove.slice(2, 4);
    const board = new ChessBoard(fenstring);
    const piece = board.pos(from);
    this.speak(Ans.adviseMove(from, to, piece));
    this.speak(Ask.waitForReactOnAdvise());
    this.contexts.set('advice-made', 1, { move: advisedMove });
  }
  
}
