import { dialogflow, DialogflowConversation } from 'actions-on-google';

import { initLanguage } from './locales/initLang';
import { ChessSide, WhoseSide, CastlingType } from './chess/chessUtils';
import { ConversationData } from './storage/conversationData';
import { LongStorageData } from './storage/longStorageData';
import { GoogleContextManager } from './handlers/struct/context/googleContextManager';
import { Handlers } from './handlers/public';

type VoiceChessConv = DialogflowConversation<ConversationData, LongStorageData>;

const app = dialogflow<ConversationData, LongStorageData>();

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
    const gCont = new GoogleContextManager(conv.contexts);
    Handlers.load(speak, gCont, conv.data, conv.user.storage, conv.close.bind(conv));
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
app.intent('Help', Handlers.help);
app.intent('Default Welcome Intent', Handlers.welcome);
app.intent('Default Fallback Intent', Handlers.fallback);
app.intent('New Game', Handlers.newGame);
app.intent('Continue Game', Handlers.continueGame);
app.intent('Board', Handlers.firstPartOfBoard);
app.intent('Board - next', Handlers.secondPartOfBoard);
app.intent('Rank', rankHandler);
app.intent('Rank - number', rankHandler);
app.intent('Rank - next', Handlers.nextRank);
app.intent('Rank - previous', Handlers.prevRank);
app.intent('Turn', turnHandler);
app.intent('Promotion', promotionHandler);
app.intent('Correct', Handlers.correct);
app.intent('Choose Side', chooseSideHandler);
app.intent('Auto move', Handlers.moveAuto);
app.intent('Castling', Handlers.castling);
app.intent('Choose Castling', chooseCastlingHandler);
app.intent('Difficulty', Handlers.difficulty);
app.intent('Difficulty - number', modifyDifficultyHandler);
app.intent('Difficulty - full', modifyDifficultyHandler);
app.intent('Legal moves', legalMovesHandler);
app.intent('History', movesHistoryHandler);
app.intent('Enable confirm', Handlers.enableConfirm);
app.intent('Disable confirm', Handlers.disableConfirm);
app.intent('Advice', Handlers.advice);
app.intent('Accept Advice', Handlers.acceptAdvice);
app.intent('Square', squareHandler);
app.intent('Piece', pieceHandler);
app.intent('All', allPiecesHandler);
app.intent('Captured', Handlers.captured);
app.intent('Resign', Handlers.resign);
app.intent('Side', sideHandler);
app.intent('Fullmove number', Handlers.fullmove);
app.intent('Next', Handlers.next);
app.intent('No', Handlers.no);
app.intent('Yes', Handlers.yes);
app.intent('Silence', Handlers.silence);
app.intent('Repeat', Handlers.repeat);

export { app };
