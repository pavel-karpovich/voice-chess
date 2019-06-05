import * as functions from 'firebase-functions';
import { dialogflow, DialogflowConversation } from 'actions-on-google';

import { Answer as Ans } from './answer';
import { Ask } from './ask';
import { Chess, chessBoardSize, ChessGameState, ChessSide } from './chess';
import { ChessBoard, ChessCellInfo } from './chessboard';
import { upFirst, pause } from './helpers';

process.env.DEBUG = 'dialogflow:debug';

interface HistoryFrame {
  type: string;
  move: string;
  beat?: string;
  promo?: string;
}

interface ConversationData {
  fallbackCount?: number;
  row?: number;
}

interface LongStorageData {
  difficulty?: number;
  fen?: string;
  side?: ChessSide;
  history?: HistoryFrame[];
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
      Ans.setLanguage(lang);
      Ask.setLanguage(lang);
    } else {
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

app.intent(
  'Default Welcome Intent',
  (conv: VoiceChessConv): void => {
    console.log('welcome');
    if (conv.user.storage.difficulty === undefined) {
      conv.user.storage.difficulty = 2;
      speak(conv, Ans.firstPlay());
      speak(conv, Ask.askToNewGame());
      conv.contexts.set('ask-to-new-game', 1);
    } else if (
      conv.user.storage.fen === undefined ||
      conv.user.storage.fen === null
    ) {
      speak(conv, Ans.welcome());
      speak(conv, Ask.askToNewGame());
      conv.contexts.set('ask-to-new-game', 1);
    } else {
      conv.contexts.set('ask-to-continue', 1);
      speak(conv, Ans.welcome());
      speak(conv, Ask.askToContinue());
    }
  }
);

function fallbackHandler(conv: VoiceChessConv): void {
  console.log('fallback');
  for (const context of restorableContexts) {
    if (conv.contexts.get(context)) {
      conv.contexts.set(context, 1);
    }
  }
  const fallbacks = conv.data.fallbackCount;
  if (isNaN(fallbacks) || fallbacks < 2) {
    if (fallbacks === 1) {
      conv.data.fallbackCount = 2;
    } else {
      conv.data.fallbackCount = 1;
    }
    speak(conv, Ans.firstFallback());
  } else if (fallbacks < 4) {
    conv.data.fallbackCount = fallbacks + 1;
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

function showRow(row: ChessCellInfo[], rowNum: number): string {
  let resultString = '';
  if (row.every(el => el.val === null)) {
    const emptyRowString = upFirst(Ans.emptyRow(rowNum));
    resultString += emptyRowString + '\n';
  } else {
    resultString += Ans.nRow(rowNum) + ': ';
    for (const cell of row) {
      if (cell.val !== null) {
        resultString += Ans.coloredPieceOnPosition(cell.val, cell.pos) + ', ';
      }
    }
    resultString = resultString.slice(0, -2) + '.\n';
  }
  return resultString;
}

function showRows(fen: string, fromRow: number, toRow: number): string {
  const board = new ChessBoard(fen);
  let result = '<p>';
  for (let i = fromRow; i <= toRow; ++i) {
    result += `<s>${showRow(board.row(i), i)}</s>${pause(0.7)}`;
  }
  result += '</p>';
  return result;
}

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
  console.log(`Ordinal: ${ord}, number: ${num}`);
  const fenstring = conv.user.storage.fen;
  const board = new ChessBoard(fenstring);
  const rowNum = num ? num : ord;
  if (!isNaN(rowNum)) {
    if (rowNum < 1 || rowNum > 8) {
      conv.data.row = undefined;
      speak(conv, Ans.incorrectRowNumber(rowNum));
      speak(conv, Ask.askRowNumber());
    }
    conv.data.row = rowNum;
    speak(conv, showRow(board.row(rowNum), rowNum));
    speak(conv, Ask.askToGoNext());
    conv.contexts.set('row-next', 1);
  } else {
    speak(conv, Ask.askRowNumber());
    conv.data.row = undefined;
  }
}

function giveNextRow(conv: VoiceChessConv): void {
  console.log('next row');
  const lastRow = conv.data.row;
  if (lastRow === 8) {
    speak(conv, Ans.noNextRow());
    speak(conv, Ask.waitMove());
    conv.contexts.set('turn-intent', 1);
    return;
  }
  conv.contexts.set('row-next', 1);
  const fenstring = conv.user.storage.fen;
  const board = new ChessBoard(fenstring);
  const thisRow = lastRow + 1;
  conv.data.row = thisRow;
  speak(conv, showRow(board.row(thisRow), thisRow));
  if (thisRow === 8) {
    speak(conv, Ask.whatToDo());
  } else {
    speak(conv, Ask.askToGoNext());
  }
}

app.intent('Row', rowHandler);
app.intent('Row - number', rowHandler);

app.intent('Row - next', giveNextRow);

function askOrRemind(conv: VoiceChessConv): void {
  const fiftyFifty = Math.random();
  if (fiftyFifty < 0.5) {
    speak(conv, Ask.askToMoveAgain());
  } else {
    speak(conv, Ask.askToRemindBoard());
    conv.contexts.set('turn-showboard', 1);
  }
}

async function moveSequence(
  conv: VoiceChessConv,
  chess: Chess,
  move: string
): Promise<void> {
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
    const pieceCode = move[4];
    ask += ' ' + Ans.moveWithPromotion(pieceCode);
  }
  let historyItem;
  if (beatedPiece) {
    if (isPromo) {
      historyItem = { type: piece, move, beat: beatedPiece, promo: move[4] };
    } else {
      historyItem = { type: piece, move, beat: beatedPiece };
    }
    ask += Ans.playerBeat(beatedPiece);
  } else {
    if (isPromo) {
      historyItem = { type: piece, move, promo: move[4] };
    } else {
      historyItem = { type: piece, move };
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
        type: 'p',
        move: chess.enemyMove,
        beat: beatedPiece,
        promo: enemyPiece,
      };
    } else {
      historyItem = {
        type: enemyPiece,
        move: chess.enemyMove,
        beat: beatedPiece,
      };
    }
    enemyStr += Ans.enemyBeat(beatedPiece);
  } else {
    if (isPromo) {
      historyItem = { type: 'p', move: chess.enemyMove, promo: enemyPiece };
    } else {
      historyItem = { type: enemyPiece, move: chess.enemyMove };
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
    const difficulty = conv.user.storage.difficulty;
    const playerSide = conv.user.storage.side;
    const chess = new Chess(fenstring, difficulty);
    if (chess.whoseTurn !== playerSide) {
      // TODO: Throwing an error isn't a good way to inform Google Action about a failure
      throw new Error(
        'Something is wrong. The player and server sides are messed.'
      );
    }
    const board = new ChessBoard(chess.fenstring);
    const actualPiece = Ans.piece(board.pos(from));
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
    await chess.updateGameState();
    const isLegal = chess.isMoveLegal(move);
    if (isLegal) {
      if (!piecesMatch) {
        speak(conv, Ans.piecesDontMatch(piece, actualPiece, from));
        speak(conv, Ask.moveWithoutPiecesMatch(actualPiece, piece, from, to));
        conv.contexts.set('confirm-move', 1, { move });
        // TODO: if it's a promotion?
        return;
      }
      if (chess.isPromotion(move)) {
        speak(conv, Ans.promotion(from, to));
        speak(conv, Ask.howToPromote());
        conv.contexts.set('ask-to-promotion', 1, { move });
        return;
      }
      await moveSequence(conv, chess, move);
    } else {
      let illegal = Ans.illegalMove(from, to, { piece });
      if (chess.currentGameState === ChessGameState.CHECK) {
        illegal = `${Ans.checkToPlayer()}${pause(2)}\n${illegal}`;
      }
      speak(conv, illegal);
      askOrRemind(conv);
    }
  }
);

app.intent(
  'Promotion',
  async (
    conv: VoiceChessConv,
    { piece2 }: { piece2: string }
  ): Promise<void> => {
    console.log('Pawn promotion to the ' + piece2);
    const promContext = conv.contexts.get('ask-to-promotion');
    let move = promContext.parameters.move as string;
    switch (piece2) {
      case Ans.piece('q'):
        move += 'q';
        break;
      case Ans.piece('r'):
        move += 'q';
        break;
      case Ans.piece('n'):
        move += 'n';
        break;
      case Ans.piece('b'):
        move += 'b';
        break;
      default:
        return;
    }
    const fenstring = conv.user.storage.fen;
    const difficulty = conv.user.storage.difficulty;
    const chess = new Chess(fenstring, difficulty);
    await moveSequence(conv, chess, move);
  }
);

app.intent(
  'Choose Side',
  async (conv: VoiceChessConv, { side }: { side: string }): Promise<void> => {
    console.log('Choose side: ' + side);
    side = side.toLowerCase();
    if (side === Ans.white()) {
      speak(conv, Ans.whiteSide());
      speak(conv, Ask.askToMove());
      conv.user.storage.side = ChessSide.WHITE;
    } else {
      speak(conv, Ans.blackSide());
      conv.user.storage.side = ChessSide.BLACK;
      const fenstring = conv.user.storage.fen;
      const difficulty = conv.user.storage.difficulty;
      const chess = new Chess(fenstring, difficulty);
      await chess.moveAuto();
      conv.user.storage.fen = chess.fenstring;
      const enemyFrom = chess.enemyMove.slice(0, 2);
      const enemyTo = chess.enemyMove.slice(2, 4);
      const board = new ChessBoard(chess.fenstring);
      const enemyPiece = board.pos(enemyTo);
      const historyItem = { type: enemyPiece, move: chess.enemyMove };
      conv.user.storage.history.push(historyItem);
      const enemyStr = Ans.enemyMove(enemyFrom, enemyTo, enemyPiece);
      const askYouStr = Ask.nowYouNeedToMove();
      speak(conv, enemyStr + '\n' + askYouStr);
    }
  }
);

app.intent(
  'Difficulty',
  (conv: VoiceChessConv): void => {
    console.log('difficulty');
    safeGameContext(conv);
    const currentDifficulty = conv.user.storage.difficulty;
    speak(conv, Ans.showDifficulty(currentDifficulty));
    speak(conv, Ask.askToChangeDifficulty());
  }
);

app.intent(
  'Difficulty - number',
  (
    conv: VoiceChessConv,
    { ord, num }: { ord?: number; num?: number }
  ): void => {
    console.log('difficulte - number');
    safeGameContext(conv);
    if (ord || num) {
      const currentDifficulty = conv.user.storage.difficulty;
      const newDifficulty = num ? num : ord;
      if (currentDifficulty === newDifficulty) {
        speak(conv, Ans.difficultyTheSame(newDifficulty));
      } else {
        speak(conv, Ans.difficultyChanged(newDifficulty, currentDifficulty));
      }
      const game = conv.contexts.get('game');
      if (game !== undefined) {
        speak(conv, Ask.waitMove());
        conv.contexts.set('turn-intent', 1);
      } else {
        speak(conv, Ask.askToNewGame());
        conv.contexts.set('ask-to-new-game', 1);
      }
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
  const difficulty = conv.user.storage.difficulty;
  const chess = new Chess(fenstring, difficulty);
  await chess.updateGameState();
  const bulkOfMoves = chess.getBulkOfMoves(startNumber);
  if (bulkOfMoves.pieces.length === 0) {
    throw new Error("Checkmate/stalemate in this place can't be!");
  }
  if (bulkOfMoves.end) {
    const ans = Ans.listMoves(bulkOfMoves.pieces) + Ans.itsAll();
    speak(conv, ans);
    speak(conv, Ask.waitMove());
  } else {
    speak(conv, Ans.listMoves(bulkOfMoves.pieces));
    speak(conv, Ask.askToGoNext());
    conv.contexts.set('moves-next', 1, { start: bulkOfMoves.next });
  }
}

app.intent('Legal moves', async (conv: VoiceChessConv) => {
  await listOfMoves(conv, 0);
});

function historyOfMoves(moves: HistoryFrame[], pSide: ChessSide): string {
  let result = '';
  let isPlayerMove = false;
  console.log('player side: ' + pSide);
  console.log('moves[0].type: ' + moves[0].type);
  console.log('gived side: ' + Ans.giveSide(moves[0].type));
  if (Ans.giveSide(moves[0].type) === pSide) {
    isPlayerMove = true;
  }
  let intro = false;
  let rnd = Math.random();
  if (rnd < 0.7 && moves.length > 1) {
    result += Ans.firstMoveInHistoryIntro() + ' ';
    intro = true;
  }
  for (const move of moves) {
    const from = move.move.slice(0, 2);
    const to = move.move.slice(2, 4);
    const optTotal = Number('beat' in move) + Number('promo' in move);
    let optCount = 0;
    const addSeparator = () => {
      optCount++;
      if (optCount === optTotal) {
        result += Ans.and() + ' ';
      } else {
        result += ', ';
      }
    };
    rnd = Math.random();
    if (rnd < 0.3 && !intro) {
      result += Ans.nextMoveInHistoryIntro() + ' ';
      intro = true;
    }
    if (isPlayerMove) {
      let firstPhrase = Ans.youMoved(move.type, from, to);
      if (!intro) {
        firstPhrase = upFirst(firstPhrase);
      }
      result += firstPhrase; 
      if (move.beat) {
        addSeparator();
        result += Ans.youTookMyPiece(move.beat);
      }
      if (move.promo) {
        addSeparator();
        result += Ans.youPromoted(move.promo);
      }
    } else {
      let firstPhrase = Ans.iMoved(move.type, from, to);
      if (!intro) {
        firstPhrase = upFirst(firstPhrase);
      }
      result += firstPhrase; 
      if (move.beat) {
        addSeparator();
        result += Ans.iTookYourPiece(move.beat);
      }
      if (move.promo) {
        addSeparator();
        result += Ans.iPromoted(move.promo);
      }
    }
    result += '.' + pause(1) + '\n';
    isPlayerMove = !isPlayerMove;
    intro = false;
  }
  return result;
}

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
  (
    conv: VoiceChessConv,
    { movesNumber }: { movesNumber?: number }
  ): void => {
  showMovesHistory(conv, movesNumber);
});

app.intent('Next', async (conv: VoiceChessConv) => {
  let isFallback = false;
  if (conv.contexts.get('moves-next')) {
    await listOfMoves(
      conv,
      Number(conv.contexts.get('moves-next').parameters.start)
    );
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
    } else {
      isFallback = true;
      fallbackHandler(conv);
    }
    if (!isFallback) {
      conv.data.fallbackCount = 0;
    }
  }
);

module.exports.fulfillment = functions.https.onRequest(app);
