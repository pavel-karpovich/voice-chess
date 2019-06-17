import { ContextManager } from './context/contextManager';
import { ConversationData } from './storage/conversationData';
import { LongStorageData } from './storage/longStorageData';
import { Answer as Ans } from './locales/answer';
import { Ask } from './locales/ask';
import { Chess, chessBoardSize, ChessGameState, maxDifficulty } from './chess/chess';
import {
  manyRanks,
  oneRank,
  allPiecesForType,
  allPiecesForSide,
  listCapturedPieces,
  someonePlayForColor,
} from './support/board';
import { ChessBoard } from './chess/chessboard';
import { pause, gaussianRandom } from './support/helpers';
import { getSide, ChessSide, CastlingType, WhoseSide, oppositeSide } from './chess/chessUtils';
import { getBulkOfMoves, listMoves } from './support/moves';
import { historyOfMoves } from './support/history';

const restorableContexts = [
  'ask-side',
  'rank-next',
  'difficulty-followup',
  'board-next',
  'ask-to-new-game',
  'ask-to-continue',
  'turn-intent',
  'turn-showboard',
  'confirm-move',
  'ask-to-promotion',
  'moves-next',
  'advice-made',
  'correct-last-move',
  'choose-castling',
  'confirm-new-game',
  'ask-to-resign',
  'reduce-difficulty-instead-of-resign',
];

export class Handlers {
  private static speak: (msg: string) => void;
  private static end: (endMsg: string) => void;

  private static contexts: ContextManager;
  private static short: ConversationData;
  private static long: LongStorageData;

  static load(
    response: (msg: string) => void,
    contextManager: ContextManager,
    shortStorage: ConversationData,
    longStorage: LongStorageData,
    endConv?: (msg: string) => void
  ) {
    this.speak = response;
    this.contexts = contextManager;
    this.short = shortStorage;
    this.long = longStorage;
    this.end = endConv || this.speak;
  }

  private static safeGameContext(): void {
    const gameContext = this.contexts.get('game');
    if (gameContext) {
      this.contexts.set('game', gameContext.lifespan + 1);
    }
  }

  private static preserveContext(): void {
    for (const context of restorableContexts) {
      if (this.contexts.get(context)) {
        this.contexts.set(context, 1);
      }
    }
  }

  private static firstGameRun(): void {
    const initialDifficulty = 2;
    const initialConfirmOpt = true;
    this.long.options = {
      difficulty: initialDifficulty,
      confirm: initialConfirmOpt,
    };
    this.speak(Ans.firstPlay());
    this.speak(Ask.askToNewGame());
    this.contexts.set('ask-to-new-game', 1);
  }

  private static createNewGame(): void {
    this.long.fen = Chess.initialFen;
    this.long.history = [];
    this.speak(Ans.newgame());
    this.speak(Ask.chooseSide());
    this.contexts.set('ask-side', 1);
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

  private static async prepareToMove(move: string, chess?: Chess): Promise<void> {
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
    if (chess.currentGameState === ChessGameState.CHECKMATE) {
      this.speak(answer + ' \n' + Ans.youWin());
      this.speak(Ask.askToNewGame());
      this.contexts.set('ask-to-new-game', 1);
      this.long.fen = null;
      this.contexts.drop('game');
      return;
    } else if (chess.currentGameState === ChessGameState.STALEMATE) {
      this.speak(`${answer} \n${Ans.stalemateToEnemy()} \n${Ans.draw()}`);
      this.speak(Ask.askToNewGame());
      this.contexts.set('ask-to-new-game', 1);
      this.long.fen = null;
      this.contexts.drop('game');
      return;
    } else if (chess.currentGameState === ChessGameState.FIFTYMOVEDRAW) {
      this.speak(`${answer} \n${Ans.fiftymove()} \n${Ans.draw()}`);
      this.speak(Ask.askToNewGame());
      this.contexts.set('ask-to-new-game', 1);
      this.long.fen = null;
      this.contexts.drop('game');
      return;
    } else if (chess.currentGameState === ChessGameState.CHECK) {
      answer += '\n' + Ans.checkToEnemy();
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
    if (chess.currentGameState === ChessGameState.CHECKMATE) {
      answer += `${answer} \n${Ans.checkmateToPlayer()} \n`;
      answer += `${Ans.youLose()} \n${Ask.askToNewGame()}`;
      this.speak(answer);
      this.contexts.set('ask-to-new-game', 1);
      this.long.fen = null;
      this.contexts.drop('game');
      return;
    } else if (chess.currentGameState === ChessGameState.STALEMATE) {
      answer += ` \n${Ans.stalemateToPlayer()} \n`;
      answer += `${Ans.draw()} \n${Ask.askToNewGame()}`;
      this.speak(answer);
      this.contexts.set('ask-to-new-game', 1);
      this.long.fen = null;
      this.contexts.drop('game');
      return;
    } else if (chess.currentGameState === ChessGameState.FIFTYMOVEDRAW) {
      answer += ` \n${Ans.fiftymove()} \n`;
      answer += `${Ans.draw()} \n${Ask.askToNewGame()}`;
      this.speak(answer);
      this.contexts.set('ask-to-new-game', 1);
      this.long.fen = null;
      this.contexts.drop('game');
      return;
    } else if (chess.currentGameState === ChessGameState.CHECK) {
      answer += '\n' + Ans.checkToPlayer() + pause(1);
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

  private static async acceptMove(): Promise<void> {
    const move = this.contexts.get('confirm-move').parameters.move as string;
    await this.prepareToMove(move);
  }

  private static directToNextLogicalAction(): void {
    const gameContext = this.contexts.get('game');
    if (gameContext) {
      this.speak(Ask.waitMove());
      this.contexts.set('turn-intent', 1);
    } else {
      this.speak(Ask.askToNewGame());
      this.contexts.set('ask-to-new-game', 1);
    }
  }
  // -------------------- PUBLIC HANDLERS --------------------

  static help(): void {
    if (this.contexts.get('game')) {
      this.speak(Ask.ingameTips());
    } else {
      this.speak(Ask.nogameTips());
    }
  }

  static welcome(): void {
    this.short.fallbackCount = 0;
    if (!this.long.options) {
      this.firstGameRun();
    } else if (!this.long.fen) {
      this.speak(Ans.welcome());
      this.speak(Ask.askToNewGame());
      this.contexts.set('ask-to-new-game', 1);
    } else {
      this.speak(Ans.welcome());
      this.speak(Ask.askToContinue());
      this.contexts.set('ask-to-continue', 1);
    }
  }

  static fallback(): void {
    this.preserveContext();
    const fallbacks = this.short.fallbackCount;
    this.short.fallbackCount = fallbacks + 1;
    if (fallbacks < 3) {
      this.speak(Ans.firstFallback());
    } else if (fallbacks === 3) {
      this.speak(Ans.secondFallback());
      this.help();
    } else {
      this.end(Ans.confusedExit());
    }
  }

  static newGame(): void {
    const fenstring = this.long.fen;
    const confirmNewGameCtx = this.contexts.get('confirm-new-game');
    if (!fenstring || confirmNewGameCtx) {
      this.createNewGame();
    } else {
      this.speak(Ask.confirmNewGame());
      this.contexts.set('ask-to-new-game', 1);
      this.contexts.set('confirm-new-game', 1);
    }
  }

  static continueGame(): void {
    const fenstring = this.long.fen;
    if (!fenstring) {
      this.speak(Ans.noGameToContinue());
      this.speak(Ask.askToNewGame());
      this.contexts.set('ask-to-new-game', 1);
      return;
    }
    this.contexts.set('game', 5);
    this.contexts.set('turn-showboard', 1);
    const playerSide = this.long.side;
    this.speak(Ans.continueGame(playerSide));
    this.speak(Ask.askToRemindBoard());
  }

  static firstPartOfBoard(): void {
    const fenstring = this.long.fen;
    let longString = `<p><s>${Ans.board1()}</s></p>\n`;
    longString += manyRanks(fenstring, 1, chessBoardSize / 2);
    this.speak(longString);
    this.speak(Ask.askToGoNext());
    this.contexts.set('board-next', 1);
  }

  static secondPartOfBoard(): void {
    const fenstring = this.long.fen;
    let longString = `<p><s>${Ans.board2()}</s></p>\n`;
    longString += manyRanks(fenstring, chessBoardSize / 2 + 1, chessBoardSize);
    this.contexts.set('turn-intent', 1);
    this.speak(longString);
    this.speak(Ask.waitMove());
  }

  static rank(ord?: string, num?: string): void {
    const fenstring = this.long.fen;
    const rankNum = Number(num ? num : ord);
    if (!isNaN(rankNum)) {
      if (rankNum < 1 || rankNum > chessBoardSize) {
        this.speak(Ans.incorrectRankNumber(rankNum));
        this.speak(Ask.askRankNumber());
        return;
      }
      this.speak(oneRank(fenstring, rankNum));
      this.speak(Ask.askToGoNext());
      this.contexts.set('rank-next', 1, { rank: rankNum, dir: 'u' });
    } else {
      this.speak(Ask.askRankNumber());
    }
  }

  static nextRank(): void {
    const rankContext = this.contexts.get('rank-next');
    const lastRank = Number(rankContext.parameters.rank);
    if (lastRank === 8) {
      this.speak(Ans.noNextRank());
      this.speak(Ask.waitMove());
      this.contexts.set('turn-intent', 1);
      return;
    }
    const fenstring = this.long.fen;
    const thisRank = lastRank + 1;
    this.speak(oneRank(fenstring, thisRank));
    if (thisRank === 8) {
      this.speak(Ask.whatToDo());
    } else {
      this.speak(Ask.askToGoNext());
      this.contexts.set('rank-next', 1, { rank: thisRank, dir: 'u' });
    }
  }

  static prevRank(): void {
    const rankContext = this.contexts.get('rank-next');
    const lastRank = Number(rankContext.parameters.rank);
    if (lastRank === 1) {
      this.speak(Ans.noPrevRank());
      this.speak(Ask.waitMove());
      this.contexts.set('turn-intent', 1);
      return;
    }
    const fenstring = this.long.fen;
    const thisRank = lastRank - 1;
    this.speak(oneRank(fenstring, thisRank));
    if (thisRank === 1) {
      this.speak(Ask.whatToDo());
    } else {
      this.speak(Ask.askToGoNext());
      this.contexts.set('rank-next', 1, { rank: thisRank, dir: 'd' });
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
      this.fallback();
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

  static difficulty(): void {
    this.safeGameContext();
    const currentDifficulty = this.long.options.difficulty;
    this.speak(Ans.showDifficulty(currentDifficulty));
    this.speak(Ask.askToChangeDifficulty());
  }

  static modifyDifficulty(num: number): void {
    this.safeGameContext();
    const currentDifficulty = this.long.options.difficulty;
    num = num > maxDifficulty ? maxDifficulty : num;
    if (currentDifficulty === num) {
      this.speak(Ans.difficultyTheSame(num));
    } else {
      this.speak(Ans.difficultyChanged(num, currentDifficulty));
      this.long.options.difficulty = num;
    }
    this.directToNextLogicalAction();
  }

  static async listOfMoves(startNumber: number): Promise<void> {
    const fenstring = this.long.fen;
    const difficulty = this.long.options.difficulty;
    const chess = new Chess(fenstring, difficulty);
    await chess.updateGameState();
    const moves = chess.legalMoves;
    if (moves.length === 0) {
      const msg = "Checkmate/stalemate in this place can't be!";
      console.log(`ERROR: ${msg}`);
      this.speak(Ans.error(msg));
      this.speak(Ask.tryAgainOrLater());
      return;
    }
    const bulkOfMoves = getBulkOfMoves(fenstring, moves, startNumber);
    if (bulkOfMoves.end) {
      const ans = listMoves(bulkOfMoves.pieces) + ' \n' + Ans.itsAll();
      this.speak(ans);
      this.speak(Ask.waitMove());
    } else {
      this.speak(listMoves(bulkOfMoves.pieces));
      this.speak(Ask.askToGoNext());
      this.contexts.set('moves-next', 1, { start: bulkOfMoves.next });
    }
  }

  static history(movesNumber?: number): void {
    const history = this.long.history;
    if (history.length === 0) {
      this.speak(Ans.emptyHistory());
      this.speak(Ask.waitMove());
      return;
    }
    movesNumber = movesNumber || history.length;
    if (movesNumber < 1) {
      this.speak(Ans.invalidMovesNumber(movesNumber));
      this.speak(Ask.whatToDo());
      return;
    }
    let answer = '';
    if (movesNumber > history.length) {
      answer += Ans.moreMovesThanWeHave(movesNumber, history.length) + '\n';
      movesNumber = history.length;
    }
    const playerSide = this.long.side;
    const requestedMoves = history.slice(history.length - movesNumber);
    answer += historyOfMoves(requestedMoves, playerSide);
    this.speak(answer);
    this.speak(Ask.waitMove());
  }

  static enableConfirm(): void {
    this.long.options.confirm = true;
    this.speak(Ans.confirmEnabled());
    this.directToNextLogicalAction();
  }

  static disableConfirm(): void {
    this.long.options.confirm = false;
    this.speak(Ans.confirmDisabled());
    this.directToNextLogicalAction();
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

  static square(square: string): void {
    const fenstring = this.long.fen;
    const playerSide = this.long.side;
    const board = new ChessBoard(fenstring);
    const reqestedPiece = board.pos(square);
    if (reqestedPiece) {
      this.speak(Ans.hereIsPieceOnPosition(square, reqestedPiece, playerSide));
    } else {
      this.speak(Ans.emptyPosition(square));
    }
    this.speak(pause(1) + Ask.nextSquare() + ' ' + Ask.orMove());
  }

  static piece(piece: string, side?: ChessSide, whose?: WhoseSide): void {
    const fenstring = this.long.fen;
    const playerSide = this.long.side;
    const board = new ChessBoard(fenstring, true);
    if (side === ChessSide.WHITE) {
      piece = piece.toUpperCase();
    }
    if (
      (whose === WhoseSide.PLAYER && playerSide === ChessSide.WHITE) ||
      (whose === WhoseSide.ENEMY && playerSide === ChessSide.BLACK)
    ) {
      piece = piece.toUpperCase();
      side = ChessSide.WHITE;
    } else {
      side = ChessSide.BLACK;
    }
    if (!side && !whose) {
      whose = WhoseSide.PLAYER;
      side = playerSide;
      if (playerSide === ChessSide.WHITE) {
        piece = piece.toUpperCase();
      }
    }
    const positions = board.allPiecesByType(piece);
    if (positions.length === 0) {
      this.speak(Ans.noSuchPieces(piece, whose));
    } else {
      const ans = allPiecesForType(piece, positions, whose, playerSide);
      this.speak(ans);
    }
    this.speak(pause(0.6) + Ask.nextPiece() + ' ' + Ask.orMove());
  }

  static all(side?: ChessSide, whose?: WhoseSide): void {
    if (!side && !whose) {
      this.fallback();
      return;
    }
    const playerSide = this.long.side;
    if (!side) {
      if (whose === WhoseSide.PLAYER) {
        side = playerSide;
      } else {
        side = oppositeSide(playerSide);
      }
    }
    const fenstring = this.long.fen;
    const board = new ChessBoard(fenstring);
    const positions = board.allPiecesBySide(side);
    this.speak(allPiecesForSide(positions, side, playerSide) + ' \n' + Ans.itsAll());
    this.speak(Ask.waitMove());
  }

  static captured(): void {
    const fenstring = this.long.fen;
    const playerSide = this.long.side;
    const board = new ChessBoard(fenstring, true);
    const captured = board.capturedPieces();
    if (captured.white.length === 0 && captured.black.length === 0) {
      this.speak(Ans.noCapturedPieces());
    } else {
      this.speak(listCapturedPieces(captured, playerSide));
    }
    this.speak(Ask.waitMove());
  }

  static resign(): void {
    const rnd = Math.random();
    if (rnd < 0.4) {
      const difficulty = this.long.options.difficulty;
      if (difficulty !== 0) {
        this.speak(Ask.wantReduceDifficulty(difficulty));
        this.contexts.set('reduce-difficulty-instead-of-resign', 1);
        return;
      }
    }
    const fenstring = this.long.fen;
    const board = new ChessBoard(fenstring);
    if (board.movesNumber < 5) {
      this.speak(Ans.wtfYouAreJustStartedANewGame());
      this.speak(Ask.waitMove());
    } else {
      this.speak(Ask.confirmResign());
      this.contexts.set('ask-to-resign', 1);
    }
  }

  static side(side?: ChessSide, who?: WhoseSide): void {
    const playerSide = this.long.side;
    this.speak(someonePlayForColor(who, side, playerSide));
    this.speak(Ask.waitMove());
  }

  static fullmove(): void {
    const fenstring = this.long.fen;
    const board = new ChessBoard(fenstring);
    const num = board.movesNumber - 1;
    if (num === 0) {
      this.speak(Ans.noFullmoves());
    } else {
      this.speak(Ans.fullmoveNumber(num));
    }
    this.speak(Ask.waitMove());
  }

  static async next(): Promise<void> {
    let isFallback = false;
    if (this.contexts.get('moves-next')) {
      const fromPoint = Number(this.contexts.get('moves-next').parameters.start);
      await this.listOfMoves(fromPoint);
    } else if (this.contexts.get('board-next')) {
      this.secondPartOfBoard();
    } else if (this.contexts.get('rank-next')) {
      const dir = this.contexts.get('rank-next').parameters.dir;
      if (dir === 'u') {
        this.nextRank();
      } else {
        this.prevRank();
      }
    } else {
      isFallback = true;
      this.fallback();
    }
    if (!isFallback) {
      this.short.fallbackCount = 0;
    }
  }

  static no(): void {
    this.safeGameContext();
    let isFallback = false;
    const gameCtx = this.contexts.get('game');
    if (this.contexts.get('turn-intent')) {
      this.speak(Ask.askWhatever());
    } else if (this.contexts.get('moves-next')) {
      this.speak(Ask.waitMove());
    } else if (this.contexts.get('board-next')) {
      this.speak(Ask.waitMove());
    } else if (this.contexts.get('rank-next')) {
      this.speak(Ask.waitMove());
    } else if (this.contexts.get('reduce-difficulty-instead-of-resign')) {
      this.speak(Ask.stillWantToResign());
      this.contexts.set('ask-to-resign', 1);
    } else if (this.contexts.get('ask-to-resign')) {
      this.speak(Ask.thenPlay());
    } else if (this.contexts.get('ask-to-new-game')) {
      this.speak(gameCtx ? Ask.thenPlay() : Ask.whatToDo());
    } else if (this.contexts.get('ask-to-continue')) {
      this.speak(Ask.askToNewGame());
      this.contexts.set('ask-to-new-game', 1);
    } else if (this.contexts.get('turn-showboard')) {
      this.speak(Ask.askToMove());
    } else if (this.contexts.get('confirm-move')) {
      if (this.contexts.get('correct-last-move')) {
        this.speak(Ask.correctFails());
      } else {
        this.speak(Ask.askToMoveAgain());
      }
    } else if (this.contexts.get('advice-made')) {
      this.speak(Ask.askToMove());
    } else if (this.contexts.get('correct-last-move')) {
      this.speak(Ask.correctFails());
    } else {
      isFallback = true;
      this.fallback();
    }
    if (!isFallback) {
      this.short.fallbackCount = 0;
    }
  }

  static async yes(): Promise<void> {
    this.safeGameContext();
    let isFallback = false;
    if (this.contexts.get('turn-intent')) {
      this.speak(Ask.askToMove());
    } else if (this.contexts.get('moves-next')) {
      const n = Number(this.contexts.get('moves-next').parameters.start);
      await this.listOfMoves(n);
    } else if (this.contexts.get('board-next')) {
      this.secondPartOfBoard();
    } else if (this.contexts.get('rank-next')) {
      const dir = this.contexts.get('rank-next').parameters.dir;
      if (dir === 'u') {
        this.nextRank();
      } else {
        this.prevRank();
      }
    } else if (this.contexts.get('reduce-difficulty-instead-of-resign')) {
      const d = this.long.options.difficulty;
      this.modifyDifficulty(Math.floor(d / 2));
    } else if (this.contexts.get('ask-to-resign')) {
      this.speak(Ans.youLose());
      this.speak(Ask.askToNewGame());
      this.contexts.set('ask-to-new-game', 1);
      this.long.fen = null;
      this.contexts.drop('game');
    } else if (this.contexts.get('ask-to-new-game')) {
      this.newGame();
    } else if (this.contexts.get('ask-to-continue')) {
      this.continueGame();
    } else if (this.contexts.get('turn-showboard')) {
      this.firstPartOfBoard();
    } else if (this.contexts.get('confirm-move')) {
      await this.acceptMove();
    } else if (this.contexts.get('advice-made')) {
      await this.acceptAdvice();
    } else {
      isFallback = true;
      this.fallback();
    }
    if (!isFallback) {
      this.short.fallbackCount = 0;
    }
  }

  static silence(): void {
    const gameContext = this.contexts.get('game');
    if (gameContext) {
      this.speak(Ans.doNotHurry());
    } else {
      this.speak(Ask.isAnybodyHere());
    }
  }

  static repeat(): void {
    this.speak('This feature is under development.');
    this.directToNextLogicalAction();
  }
}
