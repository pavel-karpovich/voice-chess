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

function intent(name: string, handler: (conv: VoiceChessConv) => void) {
  app.intent(name, handler);
  StockfishEngine.instance.kill();
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
    console.log('handler');
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
intent('Help', Handlers.help);
intent('Play chess', Handlers.welcome);
intent('Default Welcome Intent', Handlers.welcome);
intent('Default Fallback Intent', Handlers.fallback);
intent('New Game', Handlers.newGame);
intent('Continue Game', Handlers.continueGame);
intent('Board', Handlers.showBoard);
intent('Board - next', Handlers.secondPartOfBoard);
intent('Rank', rankHandler);
intent('Rank - number', rankHandler);
intent('Rank - next', Handlers.nextRank);
intent('Rank - previous', Handlers.prevRank);
intent('Turn', turnHandler);
intent('Promotion', promotionHandler);
intent('Correct', Handlers.correct);
intent('Choose Side', chooseSideHandler);
intent('Auto move', Handlers.moveAuto);
intent('Castling', Handlers.castling);
intent('Choose Castling', chooseCastlingHandler);
intent('Difficulty', Handlers.difficulty);
intent('Difficulty - number', modifyDifficultyHandler);
intent('Difficulty - full', modifyDifficultyHandler);
intent('Legal moves', legalMovesHandler);
intent('History', movesHistoryHandler);
intent('Enable confirm', Handlers.enableConfirm);
intent('Disable confirm', Handlers.disableConfirm);
intent('Advice', Handlers.advice);
intent('Accept Advice', Handlers.acceptAdvice);
intent('Square', squareHandler);
intent('Piece', pieceHandler);
intent('All', allPiecesHandler);
intent('Captured', Handlers.captured);
intent('Resign', Handlers.resign);
intent('Side', sideHandler);
intent('Fullmove number', Handlers.fullmove);
intent('Next', Handlers.next);
intent('No', Handlers.no);
intent('Yes', Handlers.yes);
intent('Silence', Handlers.silence);
intent('Repeat', Handlers.repeat);

export { app };
