import { Chess, ChessGameState } from '../../chess/chess';
import { HandlerBase } from '../struct/handlerBase';
import { Answer as Ans } from '../../locales/answer';
import { Suggestions as Sug } from '../../locales/suggestions';
import { Ask } from '../../locales/ask';
import { ChessBoard } from '../../chess/chessboard';
import { pause, shuffle } from '../../support/helpers';
import { getSide } from '../../chess/chessUtils';
import { GameHandlers } from './game';
import { createHistoryItem } from '../../support/history';

export class MoveHandlers extends HandlerBase {
  static askOrRemind(chance = 0.75): void {
    const correctCtx = this.contexts.get('correct-last-move');
    if (correctCtx) {
      this.speak(Ask.correctFails());
      return;
    }
    const fiftyFifty = Math.random();
    if (fiftyFifty < chance) {
      this.speak(Ask.askToMoveAgain());
      this.suggest(Sug.move, Sug.availableMoves, Sug.advice, Sug.history);
    } else {
      this.speak(Ask.askToRemindBoard());
      this.contexts.set('turn-showboard', 1);
      this.suggest(Sug.yes, Sug.no, Sug.move, Sug.pieceInfo);
    }
  }
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
      this.suggest(Sug.queen, Sug.knight, Sug.rook, Sug.bishop);
      return;
    }
    await this.moveByPlayer(move, chess);
    await this.moveByAI(chess);
  }

  static rollbackLastMoves(chess: Chess, final = false): void {
    const hist = this.long.history;
    const board = new ChessBoard(this.long.fen);
    const lastAIMove = hist[hist.length - 1];
    const lastPlMove = hist[hist.length - 2];
    if (final) {
      hist.length = hist.length - 2;
    }
    board.extract(lastAIMove.m.slice(1), lastAIMove.b, lastAIMove.e, lastAIMove.c);
    board.extract(lastPlMove.m.slice(1), lastPlMove.b, lastPlMove.e, lastPlMove.c);
    const cstFen = this.long.cstFen;
    board.loadCorrectCastlingFen(cstFen);
    chess.fenstring = board.convertToFen();
  }

  static async moveByPlayer(move: string, chess?: Chess, prologue?: string): Promise<void> {
    const difficulty = this.long.options.difficulty;
    if (!chess) {
      chess = new Chess(this.long.fen, difficulty);
    }
    const correctCtx = this.contexts.get('correct-last-move');
    const hist = this.long.history;
    if (correctCtx) {
      this.rollbackLastMoves(chess, true);
    }
    const from = move.slice(0, 2);
    const to = move.slice(2, 4);
    const board = new ChessBoard(chess.fenstring);
    this.long.cstFen = board.cstFen;
    const piece = board.pos(from);
    await chess.move(move);
    const isCapturing = board.isCapturing(move);
    const isEnPassant = board.isEnPassant(piece, move);
    const isCastling = board.isMoveCastling(move);
    const isPromotion = move.length === 5;
    let captured = null;
    let enPassPawn = null;
    let rookMove = null;
    let answer = '';
    if (prologue) {
      answer += prologue + pause(1) + '\n';
    }
    if (isCastling) {
      rookMove = board.rookMoveForCastlingMove(move);
      const rFrom = rookMove.slice(0, 2);
      const rTo = rookMove.slice(2, 4);
      answer += Ans.castlingByPlayer(from, to, rFrom, rTo);
    } else if (isEnPassant) {
      enPassPawn = hist[hist.length - 1].m.slice(3, 5);
      answer += Ans.enPassantPlayer(from, to, enPassPawn);
    } else {
      answer += Ans.playerMove(from, to, piece);
      if (isPromotion) {
        const promotionPieceCode = move[4];
        answer += ' ' + Ans.moveWithPromotion(promotionPieceCode);
      }
    }
    if (isCapturing) {
      captured = board.pos(to);
      answer += Ans.playerEat(captured);
    }
    const historyItem = createHistoryItem(piece, move, captured, rookMove, enPassPawn);
    hist.push(historyItem);
    this.long.fen = chess.fenstring;
    switch (chess.currentGameState) {
      case ChessGameState.CHECKMATE:
        this.speak(answer + ' \n' + Ans.youWin());
        this.speak(Ask.askToNewGame());
        GameHandlers.dropGame();
        return;
      case ChessGameState.STALEMATE:
        this.speak(`${answer} \n${Ans.stalemateToEnemy()} \n${Ans.draw()}`);
        this.speak(Ask.askToNewGame());
        GameHandlers.dropGame();
        return;
      case ChessGameState.FIFTYMOVEDRAW:
        this.speak(`${answer} \n${Ans.fiftymove()} \n${Ans.draw()}`);
        this.speak(Ask.askToNewGame());
        GameHandlers.dropGame();
        return;
      case ChessGameState.CHECK:
        answer += '\n' + Ans.checkToEnemy();
        break;
      default:
        break;
    }
    this.speak(answer);
  }

  static async moveByAI(chess?: Chess): Promise<void> {
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
    const boardAfterMove = new ChessBoard(chess.fenstring);
    const enemyPiece = boardAfterMove.pos(enemyTo);
    const isCapturing = boardBeforeMove.isCapturing(chess.enemyMove);
    const isEnPassant = boardBeforeMove.isEnPassant(enemyPiece, chess.enemyMove);
    const isCastling = boardBeforeMove.isMoveCastling(chess.enemyMove);
    const isPromotion = chess.enemyMove.length === 5;
    let captured = null;
    let rookMove = null;
    let enPassPawn = null;
    let answer = '';
    if (isCastling) {
      rookMove = boardBeforeMove.rookMoveForCastlingMove(chess.enemyMove);
      const rFrom = rookMove.slice(0, 2);
      const rTo = rookMove.slice(2, 4);
      answer += Ans.castlingByOpponent(enemyFrom, enemyTo, rFrom, rTo);
    } else if (isEnPassant) {
      enPassPawn = hist[hist.length - 1].m.slice(3, 5);
      answer += Ans.enPassantEnemy(enemyFrom, enemyTo, enPassPawn);
    } else {
      if (isPromotion) {
        answer = Ans.enemyMove(enemyFrom, enemyTo, 'p');
        answer += ' ' + Ans.moveWithPromotion(enemyPiece);
      } else {
        answer = Ans.enemyMove(enemyFrom, enemyTo, enemyPiece);
      }
    }
    if (isCapturing) {
      captured = boardBeforeMove.pos(enemyTo);
      answer += Ans.enemyEat(captured);
    }
    const historyItem = createHistoryItem(
      enemyPiece,
      chess.enemyMove,
      captured,
      rookMove,
      enPassPawn
    );
    hist.push(historyItem);
    switch (chess.currentGameState) {
      case ChessGameState.CHECKMATE:
        answer += `${answer} \n${Ans.checkmateToPlayer()} \n`;
        answer += `${Ans.youLose()} \n${Ask.askToNewGame()}`;
        this.speak(answer);
        GameHandlers.dropGame();
        return;
      case ChessGameState.STALEMATE:
        answer += ` \n${Ans.stalemateToPlayer()} \n`;
        answer += `${Ans.draw()} \n${Ask.askToNewGame()}`;
        this.speak(answer);
        GameHandlers.dropGame();
        return;
      case ChessGameState.FIFTYMOVEDRAW:
        answer += ` \n${Ans.fiftymove()} \n`;
        answer += `${Ans.draw()} \n${Ask.askToNewGame()}`;
        this.speak(answer);
        GameHandlers.dropGame();
        return;
      case ChessGameState.CHECK:
        answer += '\n' + Ans.checkToPlayer() + pause(1);
        break;
      default:
        break;
    }
    const askYouStr = Ask.nowYouNeedToMove();
    this.speak(`${pause(2)}${answer}\n${askYouStr}`);
    this.long.fen = chess.fenstring;
    const suggestions = [Sug.move];
    const chanceToGiveAdvice = Math.random();
    if (chanceToGiveAdvice < 0.3) {
      suggestions.push(Sug.advice);
    }
    const chanceToAskAboutConfirmationSettings = Math.random();
    const confirm = this.long.options.confirm;
    if (chanceToAskAboutConfirmationSettings < 0.15) {
      suggestions.push(confirm ? Sug.disableConfirm : Sug.enableConfirm);
    }
    const chanceToSuggestCorrect = Math.random();
    const suggestCorrect = chanceToSuggestCorrect < 0.4;
    const avlbCapacity = 8 - suggestions.length - Number(suggestCorrect);
    const moves = await this.moveSuggestions(avlbCapacity, chess);
    suggestions.push(...moves);
    if (suggestCorrect) {
      suggestions.push(Sug.correct);
    }
    this.suggest(...suggestions);
  }

  static async moveSuggestions(num: number, chess?: Chess): Promise<string[]> {
    if (!chess) {
      const fen = this.long.fen;
      const difficulty = this.long.options.difficulty;
      chess = new Chess(fen, difficulty);
    }
    await chess.updateGameState();
    const suggestions = [] as string[];
    if (chess.legalMoves.length < num) {
      suggestions.push(...chess.legalMoves);
    } else {
      shuffle(chess.legalMoves).forEach(move => {
        const from = move.slice(0, 2);
        if (suggestions.length < num && suggestions.every(mv => mv.slice(0, 2) !== from)) {
          suggestions.push(move);
        }
      });
    }
    return suggestions;
  }

  static async simpleMoveByAI(): Promise<void> {
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
    const suggestions = [Sug.move];
    const moves = await this.moveSuggestions(8 - suggestions.length, chess);
    suggestions.push(...moves);
    this.suggest(...suggestions);
  }

  static async playerMoveByAI(chess?: Chess): Promise<void> {
    if (!chess) {
      const fenstring = this.long.fen;
      const difficulty = this.long.options.difficulty;
      chess = new Chess(fenstring, difficulty);
    }
    const answer = Ans.playerAutoMove();
    const move = await chess.bestMove();
    await this.moveByPlayer(move, chess, answer);
  }

  static async turn(from: string, to: string, piece?: string): Promise<void> {
    from = from.toLowerCase();
    to = to.toLowerCase();
    const move = from + to;
    const fenstring = this.long.fen;
    const difficulty = this.long.options.difficulty;
    const chess = new Chess(fenstring, difficulty);
    const correctCtx = this.contexts.get('correct-last-move');
    if (correctCtx) {
      this.rollbackLastMoves(chess);
    }
    const playerSide = this.long.side;
    const board = new ChessBoard(chess.fenstring);
    if (board.moveSide !== playerSide) {
      const msg = 'The player and server sides are messed.';
      console.log(`ERROR: ${msg}`);
      this.speak(Ans.error(msg));
      this.speak(Ask.tryAgainOrLater());
      this.suggest(Sug.exit, Sug.newGame);
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
      this.suggest(Sug.confirm, Sug.no);
      return;
    }
    const needConfirm = this.long.options.confirm;
    if (needConfirm) {
      this.speak(Ask.askToConfirm(from, to, actualPiece));
      this.contexts.set('confirm-move', 1, { move });
      if (correctCtx) {
        this.contexts.set('correct-last-move', 1);
      }
      this.suggest(Sug.confirm, Sug.no);
      return;
    }
    await this.prepareToMove(move, chess);
  }
}
