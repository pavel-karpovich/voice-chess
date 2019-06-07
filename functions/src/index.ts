import * as functions from 'firebase-functions';
import { dialogflow, DialogflowConversation } from 'actions-on-google';

import { Answer as Ans } from './locales/answer';
import { Ask } from './locales/ask';
import { Vocabulary as Voc } from './locales/vocabulary';
import { Chess, chessBoardSize, ChessGameState } from './chess/chess';
import { ChessSide, getSide } from './chess/chessUtils';
import { ChessBoard } from './chess/chessboard';
import { pause } from './helpers';
import { HistoryFrame, historyOfMoves } from './history';
import { showRow, showRows} from './board';
import { getBulkOfMoves, listMoves } from './moves';

process.env.DEBUG = 'dialogflow:debug';

interface ConversationData {
  fallbackCount?: number;
}

interface Options {
  difficulty?: number;
  confirm?: boolean;
}

interface LongStorageData {
  fen?: string;
  side?: ChessSide;
  history?: HistoryFrame[];
  options?: Options;
}

type VoiceChessConv = DialogflowConversation<ConversationData, LongStorageData>;

const restorableContexts = [
  'ask-side',
  'row-next',
  'difficulty-followup',
  'board-next',
  'ask-to-new-game',
  'ask-to-continue',
  'turn-intent',
  'turn-showboard',
  'confirm-move',
  'ask-to-promotion',
  'moves-next',
];

function speak(conv: VoiceChessConv, text: string) {
  conv.ask(`<speak>${text}</speak>`);
}

const app = dialogflow<ConversationData, LongStorageData>();

app.middleware(
  (conv: VoiceChessConv): void => {
    if (conv.user.locale) {
      const lang = conv.user.locale.slice(0, 2);
      Voc.setLanguage(lang);
      Ans.setLanguage(lang);
      Ask.setLanguage(lang);
    } else {
      Voc.setLanguage();
      Ans.setLanguage();
      Ask.setLanguage();
    }
  }
);

app.middleware(
  (conv: VoiceChessConv): void => {
    if (
      conv.intent !== 'Default Fallback Intent' &&
      conv.intent !== 'Yes' &&
      conv.intent !== 'No' &&
      conv.intent !== 'Next'
    ) {
      conv.data.fallbackCount = 0;
    }
  }
);

function safeGameContext(conv: VoiceChessConv): void {
  const gameContext = conv.contexts.get('game');
  if (gameContext) {
    conv.contexts.set('game', gameContext.lifespan + 1);
  }
}

function whatDoYouWantWithTips(conv: VoiceChessConv): void {
  if (conv.contexts.get('game')) {
    speak(conv, Ask.ingameTips());
  } else {
    speak(conv, Ask.nogameTips());
  }
}

function firstGameRun(conv: VoiceChessConv): void {
  const initialDifficulty = 2;
  const initialConfirmOpt = true;
  conv.user.storage.options = {
    difficulty: initialDifficulty,
    confirm: initialConfirmOpt,
  };
  speak(conv, Ans.firstPlay());
  speak(conv, Ask.askToNewGame());
  conv.contexts.set('ask-to-new-game', 1);
}

app.intent(
  'Default Welcome Intent',
  (conv: VoiceChessConv): void => {
    console.log('welcome');
    conv.data.fallbackCount = 0;
    if (!conv.user.storage.options) {
      firstGameRun(conv);
    } else if (!conv.user.storage.fen) {
      speak(conv, Ans.welcome());
      speak(conv, Ask.askToNewGame());
      conv.contexts.set('ask-to-new-game', 1);
    } else {
      speak(conv, Ans.welcome());
      speak(conv, Ask.askToContinue());
      conv.contexts.set('ask-to-continue', 1);
    }
  }
);

function preserveContext(conv: VoiceChessConv): void {
  for (const context of restorableContexts) {
    if (conv.contexts.get(context)) {
      conv.contexts.set(context, 1);
    }
  }
}
function fallbackHandler(conv: VoiceChessConv): void {
  console.log('fallback');
  preserveContext(conv);
  const fallbacks = conv.data.fallbackCount;
  conv.data.fallbackCount = fallbacks + 1;
  if (fallbacks < 2) {
    speak(conv, Ans.firstFallback());
  } else if (fallbacks < 4) {
    speak(conv, Ans.secondFallback());
    whatDoYouWantWithTips(conv);
  } else {
    conv.close(Ans.confusedExit());
  }
}
app.intent('Default Fallback Intent', fallbackHandler);

function startNewGame(conv: VoiceChessConv): void {
  console.log('new game');
  conv.user.storage.fen = Chess.initialFen;
  conv.user.storage.history = [];
  speak(conv, Ans.newgame());
  speak(conv, Ask.chooseSide());
  conv.contexts.set('ask-side', 1);
}
app.intent('New Game', startNewGame);

function continueGame(conv: VoiceChessConv): void {
  console.log('continue game');
  const fenstring = conv.user.storage.fen;
  if (!fenstring) {
    speak(conv, Ans.noGameToContinue());
    speak(conv, Ask.askToNewGame());
    conv.contexts.set('ask-to-new-game', 1);
    return;
  }
  conv.contexts.set('game', 5);
  conv.contexts.set('turn-showboard', 1);
  const playerSide = conv.user.storage.side;
  speak(conv, Ans.continueGame(playerSide));
  speak(conv, Ask.askToRemindBoard());
}
app.intent('Continue Game', continueGame);

function beginShowingTheBoard(conv: VoiceChessConv): void {
  console.log('viewing the board');
  const fenstring = conv.user.storage.fen;
  let longString = `<p><s>${Ans.board1()}</s></p>\n`;
  longString += showRows(fenstring, 1, chessBoardSize / 2);
  speak(conv, longString);
  speak(conv, Ask.askToGoNext());
  conv.contexts.set('board-next', 1);
}

function giveSecondPartOfTheBoard(conv: VoiceChessConv): void {
  console.log('board - next');
  const fenstring = conv.user.storage.fen;
  let longString = `<p><s>${Ans.board2()}</s></p>\n`;
  longString += showRows(fenstring, chessBoardSize / 2 + 1, chessBoardSize);
  conv.contexts.set('turn-intent', 1);
  speak(conv, longString);
  speak(conv, Ask.waitMove());
}

app.intent('Board', beginShowingTheBoard);
app.intent('Board - next', giveSecondPartOfTheBoard);

function rowHandler(
  conv: VoiceChessConv,
  { ord, num }: { ord?: number; num?: number }
): void {
  console.log('Single row');
  const fenstring = conv.user.storage.fen;
  const rowNum = num ? num : ord;
  if (!isNaN(rowNum)) {
    if (rowNum < 1 || rowNum > 8) {
      speak(conv, Ans.incorrectRowNumber(rowNum));
      speak(conv, Ask.askRowNumber());
    }
    speak(conv, showRow(fenstring, rowNum));
    speak(conv, Ask.askToGoNext());
    conv.contexts.set('row-next', 1, { row: rowNum });
  } else {
    speak(conv, Ask.askRowNumber());
  }
}

function giveNextRow(conv: VoiceChessConv): void {
  console.log('next row');
  const rowContext = conv.contexts.get('row-next');
  const lastRow = rowContext.parameters.row as number;
  if (lastRow === 8) {
    speak(conv, Ans.noNextRow());
    speak(conv, Ask.waitMove());
    conv.contexts.set('turn-intent', 1);
    return;
  }
  const fenstring = conv.user.storage.fen;
  const thisRow = lastRow + 1;
  speak(conv, showRow(fenstring, thisRow));
  if (thisRow === 8) {
    speak(conv, Ask.whatToDo());
  } else {
    speak(conv, Ask.askToGoNext());
    conv.contexts.set('row-next', 1, { row: thisRow });
  }
}

app.intent('Row', rowHandler);
app.intent('Row - number', rowHandler);
app.intent('Row - next', giveNextRow);

function askOrRemind(conv: VoiceChessConv): void {
  const fiftyFifty = Math.random();
  if (fiftyFifty < 0.65) {
    speak(conv, Ask.askToMoveAgain());
  } else {
    speak(conv, Ask.askToRemindBoard());
    conv.contexts.set('turn-showboard', 1);
  }
}

async function makeMoves(
  conv: VoiceChessConv,
  move: string,
  chess?: Chess
): Promise<void> {
  if (!chess) {
    const fenstring = conv.user.storage.fen;
    const difficulty = conv.user.storage.options.difficulty;
    chess = new Chess(fenstring, difficulty);
  }
  const from = move.slice(0, 2);
  const to = move.slice(2, 4);
  let board = new ChessBoard(chess.fenstring);
  const piece = board.pos(from);
  let beatedPiece = board.pos(to);
  await chess.move(move);
  console.log('Fen after player move: ' + chess.fenstring);
  console.log('And state: ' + chess.currentGameState);
  let ask = Ans.playerMove(from, to, piece);
  let isPromo = move.length === 5;
  if (isPromo) {
    const promotionPieceCode = move[4];
    ask += ' ' + Ans.moveWithPromotion(promotionPieceCode);
  }
  let historyItem;
  if (beatedPiece) {
    if (isPromo) {
      historyItem = { code: piece, move, beat: beatedPiece, promo: move[4] };
    } else {
      historyItem = { code: piece, move, beat: beatedPiece };
    }
    ask += Ans.playerBeat(beatedPiece);
  } else {
    if (isPromo) {
      historyItem = { code: piece, move, promo: move[4] };
    } else {
      historyItem = { code: piece, move };
    }
  }
  // TODO: history.info for castling and En passant
  conv.user.storage.history.push(historyItem);
  if (chess.currentGameState === ChessGameState.CHECKMATE) {
    speak(conv, ask + ' \n' + Ans.youWin());
    speak(conv, Ask.askToNewGame());
    conv.contexts.set('ask-to-new-game', 1);
    conv.user.storage.fen = null;
    conv.contexts.delete('game');
    return;
  } else if (chess.currentGameState === ChessGameState.STALEMATE) {
    speak(conv, `${ask} \n${Ans.stalemateToEnemy()} \n${Ans.draw()}`);
    speak(conv, Ask.askToNewGame());
    conv.contexts.set('ask-to-new-game', 1);
    conv.user.storage.fen = null;
    conv.contexts.delete('game');
    return;
  } else if (chess.currentGameState === ChessGameState.FIFTYMOVEDRAW) {
    speak(conv, `${ask} \n${Ans.fiftymove()} \n${Ans.draw()}`);
    speak(conv, Ask.askToNewGame());
    conv.contexts.set('ask-to-new-game', 1);
    conv.user.storage.fen = null;
    conv.contexts.delete('game');
    return;
  } else if (chess.currentGameState === ChessGameState.CHECK) {
    ask += '\n' + Ans.checkToEnemy();
  }
  speak(conv, ask);
  board = new ChessBoard(chess.fenstring);
  await chess.moveAuto();
  console.log('Fen after AI move: ' + chess.fenstring);
  console.log('And state: ' + chess.currentGameState);
  const enemyFrom = chess.enemyMove.slice(0, 2);
  const enemyTo = chess.enemyMove.slice(2, 4);
  beatedPiece = board.pos(enemyTo);
  board = new ChessBoard(chess.fenstring);
  const enemyPiece = board.pos(enemyTo);
  let enemyStr = null;
  isPromo = chess.enemyMove.length === 5;
  if (isPromo) {
    enemyStr = Ans.enemyMove(enemyFrom, enemyTo, 'p');
    enemyStr += ' ' + Ans.moveWithPromotion(enemyPiece);
  } else {
    enemyStr = Ans.enemyMove(enemyFrom, enemyTo, enemyPiece);
  }
  if (beatedPiece) {
    if (isPromo) {
      historyItem = {
        code: 'p',
        move: chess.enemyMove,
        beat: beatedPiece,
        promo: enemyPiece,
      };
    } else {
      historyItem = {
        code: enemyPiece,
        move: chess.enemyMove,
        beat: beatedPiece,
      };
    }
    enemyStr += Ans.enemyBeat(beatedPiece);
  } else {
    if (isPromo) {
      historyItem = { code: 'p', move: chess.enemyMove, promo: enemyPiece };
    } else {
      historyItem = { code: enemyPiece, move: chess.enemyMove };
    }
  }
  // history.info for castling and En passant
  conv.user.storage.history.push(historyItem);
  if ((chess.currentGameState as ChessGameState) === ChessGameState.CHECKMATE) {
    speak(conv, `${enemyStr} \n${Ans.youLose()} \n${Ask.askToNewGame()}`);
    conv.contexts.set('ask-to-new-game', 1);
    conv.user.storage.fen = null;
    conv.contexts.delete('game');
    return;
  } else if (
    (chess.currentGameState as ChessGameState) === ChessGameState.STALEMATE
  ) {
    speak(
      conv,
      `${enemyStr} \n${Ans.stalemateToPlayer()} \n${Ans.draw()} \n${Ask.askToNewGame()}`
    );
    conv.contexts.set('ask-to-new-game', 1);
    conv.user.storage.fen = null;
    conv.contexts.delete('game');
    return;
  } else if (
    (chess.currentGameState as ChessGameState) === ChessGameState.FIFTYMOVEDRAW
  ) {
    speak(
      conv,
      `${enemyStr} \n${Ans.fiftymove()} \n${Ans.draw()} \n${Ask.askToNewGame()}`
    );
    conv.contexts.set('ask-to-new-game', 1);
    conv.user.storage.fen = null;
    conv.contexts.delete('game');
    return;
  } else if (chess.currentGameState === ChessGameState.CHECK) {
    enemyStr += '\n' + Ans.checkToPlayer() + pause(1);
  }
  const askYouStr = Ask.nowYouNeedToMove();
  speak(conv, `${pause(2)}${enemyStr}\n${askYouStr}`);
  conv.user.storage.fen = chess.fenstring;
}

app.intent(
  'Turn',
  async (
    conv: VoiceChessConv,
    { from, to, piece }: { from: string; to: string; piece?: string }
  ): Promise<void> => {
    console.log('chess turn');
    from = from.toLowerCase();
    to = to.toLowerCase();
    const move = from + to;
    console.log(`From: ${from}, to: ${to}`);
    const fenstring = conv.user.storage.fen;
    const difficulty = conv.user.storage.options.difficulty;
    const playerSide = conv.user.storage.side;
    const chess = new Chess(fenstring, difficulty);
    if (chess.whoseTurn !== playerSide) {
      // TODO: Throwing an error isn't a good way to inform Google Action about a failure
      throw new Error(
        'Something is wrong. The player and server sides are messed.'
      );
    }
    const board = new ChessBoard(chess.fenstring);
    const actualPiece = board.pos(from);
    let piecesMatch = true;
    if (!piece && !actualPiece) {
      speak(conv, Ans.cellIsEmpty(from));
      askOrRemind(conv);
      return;
    } else if (piece && !actualPiece) {
      speak(conv, Ans.cellIsEmpty(from, piece));
      askOrRemind(conv);
      return;
    } else if (!piece && actualPiece) {
      piece = actualPiece;
    } else if (piece !== actualPiece) {
      piecesMatch = false;
    }
    if (getSide(actualPiece) !== playerSide) {
      speak(conv, Ans.wrongSide(playerSide, from, actualPiece));
      askOrRemind(conv);
      return;
    }
    await chess.updateGameState();
    const isLegal = chess.isMoveLegal(move);
    if (!isLegal) {
      let illegal = Ans.illegalMove(from, to, piece);
      if (chess.currentGameState === ChessGameState.CHECK) {
        illegal = `${Ans.checkToPlayer()}${pause(2)}\n${illegal}`;
      }
      speak(conv, illegal);
      askOrRemind(conv);
      return;
    }
    if (!piecesMatch) {
      speak(conv, Ans.piecesDontMatch(piece, actualPiece, from));
      speak(conv, Ask.moveWithoutPiecesMatch(actualPiece, piece, from, to));
      conv.contexts.set('confirm-move', 1, { move });
      return;
    }
    const needConfirm = conv.user.storage.options.confirm;
    if (needConfirm) {
      speak(conv, Ask.askToConfirm(from, to, actualPiece));
      conv.contexts.set('confirm-move', 1, { move });
      return;
    }
    if (chess.isPromotion(move)) {
      const from = move.slice(0, 2);
      const to = move.slice(2, 4);
      speak(conv, Ans.promotion(from, to));
      speak(conv, Ask.howToPromote());
      conv.contexts.set('ask-to-promotion', 1, { move });
      return;
    }
    await makeMoves(conv, move, chess);
  }
);

async function acceptMove(conv: VoiceChessConv): Promise<void> {
  const move = conv.contexts.get('confirm-move').parameters.move as string;
  const fenstring = conv.user.storage.fen;
  const difficulty = conv.user.storage.options.difficulty;
  const chess = new Chess(fenstring, difficulty);
  await chess.updateGameState();
  if (chess.isPromotion(move)) {
    const from = move.slice(0, 2);
    const to = move.slice(2, 4);
    speak(conv, Ans.promotion(from, to));
    speak(conv, Ask.howToPromote());
    conv.contexts.set('ask-to-promotion', 1, { move });
    return;
  }
  await makeMoves(conv, move, chess);
}

app.intent(
  'Promotion',
  async (
    conv: VoiceChessConv,
    { piece2 }: { piece2: string }
  ): Promise<void> => {
    console.log('Pawn promotion to the ' + piece2);
    const promContext = conv.contexts.get('ask-to-promotion');
    let move = promContext.parameters.move as string;
    move += piece2;
    await makeMoves(conv, move);
  }
);

app.intent(
  'Choose Side',
  async (conv: VoiceChessConv, { side }: { side: number }): Promise<void> => {
    try {
      console.log('Choose side: ' + side);
      console.log('White side: ' + ChessSide.WHITE);
      console.log('Equal: ' + (side === Number(ChessSide.WHITE)));
      conv.user.storage.side = side;
      console.log('conv.user.storage.side:' + conv.user.storage.side);
      if (side === Number(ChessSide.WHITE)) {
        console.log('white');
        speak(conv, Ans.whiteSide());
        console.log(1);
        speak(conv, Ask.askToMove());
        console.log(2);
      } else {
        console.log('black');
        speak(conv, Ans.blackSide());
        const fenstring = conv.user.storage.fen;
        const difficulty = conv.user.storage.options.difficulty;
        const chess = new Chess(fenstring, difficulty);
        await chess.moveAuto();
        conv.user.storage.fen = chess.fenstring;
        const enemyFrom = chess.enemyMove.slice(0, 2);
        const enemyTo = chess.enemyMove.slice(2, 4);
        const board = new ChessBoard(chess.fenstring);
        const enemyPiece = board.pos(enemyTo);
        const historyItem = { code: enemyPiece, move: chess.enemyMove };
        conv.user.storage.history.push(historyItem);
        const enemyStr = Ans.enemyMove(enemyFrom, enemyTo, enemyPiece);
        const askYouStr = Ask.nowYouNeedToMove();
        speak(conv, enemyStr + '\n' + askYouStr);
      }
    }
    catch (e) {
      console.log('Error: ' + e);
    }
  }
);

app.intent(
  'Difficulty',
  (conv: VoiceChessConv): void => {
    console.log('difficulty');
    safeGameContext(conv);
    const currentDifficulty = conv.user.storage.options.difficulty;
    speak(conv, Ans.showDifficulty(currentDifficulty));
    speak(conv, Ask.askToChangeDifficulty());
  }
);

function directToNextLogicalAction(conv: VoiceChessConv): void {
  const gameContext = conv.contexts.get('game');
  if (gameContext) {
    speak(conv, Ask.waitMove());
    conv.contexts.set('turn-intent', 1);
  } else {
    speak(conv, Ask.askToNewGame());
    conv.contexts.set('ask-to-new-game', 1);
  }
}

app.intent(
  'Difficulty - number',
  (
    conv: VoiceChessConv,
    { ord, num }: { ord?: number; num?: number }
  ): void => {
    console.log('difficulte - number');
    safeGameContext(conv);
    if (ord || num) {
      const currentDifficulty = conv.user.storage.options.difficulty;
      const newDifficulty = num ? num : ord;
      if (currentDifficulty === newDifficulty) {
        speak(conv, Ans.difficultyTheSame(newDifficulty));
      } else {
        speak(conv, Ans.difficultyChanged(newDifficulty, currentDifficulty));
      }
      directToNextLogicalAction(conv);
    } else {
      speak(conv, Ask.difficultyWithoutValue());
      conv.contexts.set('difficulty-followup', 1);
    }
  }
);

async function listOfMoves(
  conv: VoiceChessConv,
  startNumber: number
): Promise<void> {
  console.log('legal moves');
  const fenstring = conv.user.storage.fen;
  const difficulty = conv.user.storage.options.difficulty;
  const chess = new Chess(fenstring, difficulty);
  await chess.updateGameState();
  const moves = chess.legalMoves;
  if (moves.length === 0) {
    throw new Error("Checkmate/stalemate in this place can't be!");
  }
  const bulkOfMoves = getBulkOfMoves(fenstring, moves, startNumber);
  if (bulkOfMoves.end) {
    const ans = listMoves(bulkOfMoves.pieces) + ' \n' + Ans.itsAll();
    speak(conv, ans);
    speak(conv, Ask.waitMove());
  } else {
    speak(conv, listMoves(bulkOfMoves.pieces));
    speak(conv, Ask.askToGoNext());
    conv.contexts.set('moves-next', 1, { start: bulkOfMoves.next });
  }
}

app.intent('Legal moves', async (conv: VoiceChessConv) => {
  await listOfMoves(conv, 0);
});

function showMovesHistory(conv: VoiceChessConv, movesNumber?: number): void {
  const history = conv.user.storage.history;
  if (history.length === 0) {
    speak(conv, Ans.emptyHistory());
    speak(conv, Ask.waitMove());
    return;
  }
  movesNumber = movesNumber || history.length;
  if (movesNumber < 1) {
    speak(conv, Ans.invalidMovesNumber(movesNumber));
    speak(conv, Ask.whatToDo());
    return;
  }
  let answer = '';
  if (movesNumber > history.length) {
    answer += Ans.moreMovesThanWeHave(movesNumber, history.length) + '\n';
    movesNumber = history.length;
  }
  const playerSide = conv.user.storage.side;
  const requestedMoves = history.slice(history.length - movesNumber);
  answer += historyOfMoves(requestedMoves, playerSide);
  speak(conv, answer);
  speak(conv, Ask.waitMove());
}

app.intent(
  'History',
  (conv: VoiceChessConv, { movesNumber }: { movesNumber?: number }): void => {
    showMovesHistory(conv, movesNumber);
  }
);

app.intent(
  'Enable confirm',
  (conv: VoiceChessConv): void => {
    conv.user.storage.options.confirm = true;
    speak(conv, Ans.confirmEnabled());
    directToNextLogicalAction(conv);
  }
);

app.intent(
  'Disable confirm',
  (conv: VoiceChessConv): void => {
    conv.user.storage.options.confirm = false;
    speak(conv, Ans.confirmDisabled());
    directToNextLogicalAction(conv);
  }
);

app.intent('Next', async (conv: VoiceChessConv) => {
  let isFallback = false;
  if (conv.contexts.get('moves-next')) {
    const fromPoint = Number(conv.contexts.get('moves-next').parameters.start);
    await listOfMoves(conv, fromPoint);
  } else if (conv.contexts.get('board-next')) {
    giveSecondPartOfTheBoard(conv);
  } else if (conv.contexts.get('row-next')) {
    giveNextRow(conv);
  } else {
    isFallback = true;
    fallbackHandler(conv);
  }
  if (!isFallback) {
    conv.data.fallbackCount = 0;
  }
});

app.intent(
  'No',
  (conv: VoiceChessConv): void => {
    console.log('no');
    safeGameContext(conv);
    let isFallback = false;
    if (conv.contexts.get('turn-intent')) {
      speak(conv, Ask.askWhatever());
    } else if (conv.contexts.get('moves-next')) {
      speak(conv, Ask.waitMove());
    } else if (conv.contexts.get('board-next')) {
      speak(conv, Ask.waitMove());
    } else if (conv.contexts.get('row-next')) {
      speak(conv, Ask.waitMove());
    } else if (conv.contexts.get('ask-to-new-game')) {
      speak(conv, Ask.whatToDo());
    } else if (conv.contexts.get('ask-to-continue')) {
      speak(conv, Ask.askToNewGame());
      conv.contexts.set('ask-to-new-game', 1);
    } else if (conv.contexts.get('turn-showboard')) {
      speak(conv, Ask.askToMove());
    } else if (conv.contexts.get('confirm-move')) {
      speak(conv, Ask.askToMoveAgain());
    } else {
      isFallback = true;
      fallbackHandler(conv);
    }
    if (!isFallback) {
      conv.data.fallbackCount = 0;
    }
  }
);

app.intent(
  'Yes',
  async (conv: VoiceChessConv): Promise<void> => {
    console.log('yes');
    safeGameContext(conv);
    let isFallback = false;
    if (conv.contexts.get('turn-intent')) {
      speak(conv, Ask.askToMove());
    } else if (conv.contexts.get('moves-next')) {
      await listOfMoves(
        conv,
        Number(conv.contexts.get('moves-next').parameters.start)
      );
    } else if (conv.contexts.get('board-next')) {
      giveSecondPartOfTheBoard(conv);
    } else if (conv.contexts.get('row-next')) {
      giveNextRow(conv);
    } else if (conv.contexts.get('ask-to-new-game')) {
      startNewGame(conv);
    } else if (conv.contexts.get('ask-to-continue')) {
      continueGame(conv);
    } else if (conv.contexts.get('turn-showboard')) {
      beginShowingTheBoard(conv);
    } else if (conv.contexts.get('confirm-move')) {
      await acceptMove(conv);
    } else {
      isFallback = true;
      fallbackHandler(conv);
    }
    if (!isFallback) {
      conv.data.fallbackCount = 0;
    }
  }
);

app.intent(
  'Silence',
  (conv: VoiceChessConv): void => {
    const gameContext = conv.contexts.get('game');
    if (gameContext) {
      speak(conv, Ans.doNotHurry());
    } else {
      speak(conv, Ask.isAnybodyHere());
    }
  }
);

app.intent('Repeat', async (conv: VoiceChessConv): Promise<void> => {
  speak(conv, 'This feature is under development.');
  directToNextLogicalAction(conv);
});

module.exports.fulfillment = functions.https.onRequest(app);
