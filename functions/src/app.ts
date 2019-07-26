import { dialogflow, DialogflowConversation, Suggestions } from 'actions-on-google';

import { initLanguage } from './locales/initLang';
import { ChessSide, WhoseSide } from './chess/chessUtils';
import { ConversationData } from './storage/conversationData';
import { LongStorageData } from './storage/longStorageData';
import { GoogleContextManager } from './handlers/struct/context/googleContextManager';
import { Handlers } from './handlers/public';
import { CastlingType } from './chess/castling';
import { StockfishEngine } from './chess/stockfish/engine';

type VoiceChessConv = DialogflowConversation<ConversationData, LongStorageData>;

const app = dialogflow<ConversationData, LongStorageData>();

function registerFulfillment(
  name: string,
  handler: (conv: VoiceChessConv) => Promise<void> | void
) {
  app.intent(name, async (conv: VoiceChessConv) => {
    console.log(name);
    const ret = handler(conv);
    if (ret instanceof Promise) {
      await ret;
    }
    if (StockfishEngine.instance) {
      StockfishEngine.instance.kill();
      StockfishEngine.instance = null;
    }
  });
}

app.middleware(
  (conv: VoiceChessConv): void => {
    if (conv.user.locale) {
      const lang = conv.user.locale.slice(0, 2);
      initLanguage(lang);
    } else {
      initLanguage();
    }
  }
);

app.middleware(
  (conv: VoiceChessConv): void => {
    function speak(text: string) {
      conv.ask(`<speak>${text}</speak>`);
    }
    function suggest(...ss: string[]) {
      conv.ask(new Suggestions(ss.filter((_, i) => i < 8)));
    }
    const gCont = new GoogleContextManager(conv.contexts);
    Handlers.load(speak, gCont, conv.data, conv.user.storage, suggest, conv.close.bind(conv));
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

function rankHandler(conv: VoiceChessConv): void {
  const ord = conv.parameters.ord as string;
  const num = conv.parameters.num as string;
  Handlers.rank(ord, num);
}
async function turnHandler(conv: VoiceChessConv): Promise<void> {
  const from = conv.parameters.from as string;
  const to = conv.parameters.to as string;
  const piece = conv.parameters.piece as string;
  await Handlers.turn(from, to, piece);
}
async function promotionHandler(conv: VoiceChessConv): Promise<void> {
  const toPiece = conv.parameters.piece2 as string;
  await Handlers.promotion(toPiece);
}
async function chooseSideHandler(conv: VoiceChessConv): Promise<void> {
  const side = conv.parameters.side as ChessSide;
  await Handlers.chooseSide(side);
}
async function chooseCastlingHandler(conv: VoiceChessConv): Promise<void> {
  const cast = conv.parameters.cast as CastlingType;
  const piece = conv.parameters.piece as string;
  const cell = conv.parameters.cell as string;
  await Handlers.chooseCastling(cast, piece, cell);
}
function modifyDifficultyHandler(conv: VoiceChessConv): void {
  const num = Number(conv.parameters.num);
  Handlers.modifyDifficulty(num);
}
async function legalMovesHandler(conv: VoiceChessConv): Promise<void> {
  await Handlers.listOfMoves(0);
}
function movesHistoryHandler(conv: VoiceChessConv): void {
  const num = Number(conv.parameters.movesNumber);
  Handlers.history(num);
}
function squareHandler(conv: VoiceChessConv): void {
  const square = conv.parameters.square as string;
  Handlers.square(square);
}
function pieceHandler(conv: VoiceChessConv): void {
  const piece = conv.parameters.piece as string;
  const side = conv.parameters.side as ChessSide;
  const whose = conv.parameters.whose as WhoseSide;
  Handlers.piece(piece, side, whose);
}
function allPiecesHandler(conv: VoiceChessConv): void {
  const side = conv.parameters.side as ChessSide;
  const whose = conv.parameters.whose as WhoseSide;
  Handlers.all(side, whose);
}
function sideHandler(conv: VoiceChessConv): void {
  const side = conv.parameters.side as ChessSide;
  const whose = conv.parameters.whose as WhoseSide;
  Handlers.side(side, whose);
}
registerFulfillment('Help', Handlers.help);
registerFulfillment('Play chess', Handlers.welcome);
registerFulfillment('Default Welcome Intent', Handlers.welcome);
registerFulfillment('Default Fallback Intent', Handlers.fallback);
registerFulfillment('New Game', Handlers.newGame);
registerFulfillment('Continue Game', Handlers.continueGame);
registerFulfillment('Board', Handlers.showBoard);
registerFulfillment('Board - next', Handlers.secondPartOfBoard);
registerFulfillment('Rank', rankHandler);
registerFulfillment('Rank - number', rankHandler);
registerFulfillment('Rank - next', Handlers.nextRank);
registerFulfillment('Rank - previous', Handlers.prevRank);
registerFulfillment('Turn', turnHandler);
registerFulfillment('Promotion', promotionHandler);
registerFulfillment('Correct', Handlers.correct);
registerFulfillment('Choose Side', chooseSideHandler);
registerFulfillment('Auto move', Handlers.moveAuto);
registerFulfillment('Castling', Handlers.castling);
registerFulfillment('Choose Castling', chooseCastlingHandler);
registerFulfillment('Difficulty', Handlers.difficulty);
registerFulfillment('Difficulty - number', modifyDifficultyHandler);
registerFulfillment('Difficulty - full', modifyDifficultyHandler);
registerFulfillment('Legal moves', legalMovesHandler);
registerFulfillment('History', movesHistoryHandler);
registerFulfillment('Enable confirm', Handlers.enableConfirm);
registerFulfillment('Disable confirm', Handlers.disableConfirm);
registerFulfillment('Advice', Handlers.advice);
registerFulfillment('Accept Advice', Handlers.acceptAdvice);
registerFulfillment('Square', squareHandler);
registerFulfillment('Piece', pieceHandler);
registerFulfillment('All', allPiecesHandler);
registerFulfillment('Captured', Handlers.captured);
registerFulfillment('Resign', Handlers.resign);
registerFulfillment('Side', sideHandler);
registerFulfillment('Fullmove number', Handlers.fullmove);
registerFulfillment('Next', Handlers.next);
registerFulfillment('No', Handlers.no);
registerFulfillment('Yes', Handlers.yes);
registerFulfillment('Silence', Handlers.silence);
registerFulfillment('Repeat', Handlers.repeat);

export { app };
