import { ContextManager } from './struct/context/contextManager';
import { ConversationData } from '../storage/conversationData';
import { LongStorageData } from '../storage/longStorageData';
import { HandlerBase } from './struct/handlerBase';
import { MoveHandlers } from './private/move';
import { SettingsHandlers } from './private/settings';
import { InfoHandlers } from './private/info';
import { GameHandlers } from './private/game';
import { NavigationHandlers } from './private/naviagation';
import { AroundMoveHandlers } from './private/aroundMove';
import { FallbackHandlers } from './private/fallback';
import { OtherHandlers } from './private/other';

export class Handlers extends HandlerBase {
  static load(
    response: (msg: string) => void,
    contextManager: ContextManager,
    shortStorage: ConversationData,
    longStorage: LongStorageData,
    endConv?: (msg: string) => void
  ) {
    super.load(response, contextManager, shortStorage, longStorage, endConv);
    MoveHandlers.load(response, contextManager, shortStorage, longStorage, endConv);
    SettingsHandlers.load(response, contextManager, shortStorage, longStorage, endConv);
    InfoHandlers.load(response, contextManager, shortStorage, longStorage, endConv);
    GameHandlers.load(response, contextManager, shortStorage, longStorage, endConv);
    NavigationHandlers.load(response, contextManager, shortStorage, longStorage, endConv);
    AroundMoveHandlers.load(response, contextManager, shortStorage, longStorage, endConv);
    FallbackHandlers.load(response, contextManager, shortStorage, longStorage, endConv);
    OtherHandlers.load(response, contextManager, shortStorage, longStorage, endConv);
  }

  static newGame = GameHandlers.newGame;
  static continueGame = GameHandlers.continueGame;
  static resign = () => GameHandlers.resign();
  static welcome = GameHandlers.welcome;

  static next = NavigationHandlers.next;
  static yes = NavigationHandlers.yes;
  static no = NavigationHandlers.no;

  static difficulty = SettingsHandlers.difficulty;
  static modifyDifficulty = SettingsHandlers.modifyDifficulty;
  static enableConfirm = SettingsHandlers.enableConfirm;
  static disableConfirm = SettingsHandlers.disableConfirm;

  static turn = MoveHandlers.turn;

  static promotion = AroundMoveHandlers.promotion;
  static chooseSide = AroundMoveHandlers.chooseSide;
  static moveAuto = AroundMoveHandlers.moveAuto;
  static castling = AroundMoveHandlers.castling;
  static correct = AroundMoveHandlers.correct;
  static chooseCastling = AroundMoveHandlers.chooseCastling;
  static acceptAdvice = AroundMoveHandlers.acceptAdvice;
  static advice = AroundMoveHandlers.advice;

  static firstPartOfBoard = InfoHandlers.firstPartOfBoard;
  static secondPartOfBoard = InfoHandlers.secondPartOfBoard;
  static rank = InfoHandlers.rank;
  static nextRank = InfoHandlers.nextRank;
  static prevRank = InfoHandlers.prevRank;
  static listOfMoves = InfoHandlers.listOfMoves;
  static history = InfoHandlers.history;
  static square = InfoHandlers.square;
  static piece = InfoHandlers.piece;
  static all = InfoHandlers.all;
  static captured = InfoHandlers.captured;
  static side = InfoHandlers.side;
  static fullmove = InfoHandlers.fullmove;

  static fallback = FallbackHandlers.fallback;

  static help = OtherHandlers.help;
  static silence = OtherHandlers.silence;
  static repeat = OtherHandlers.repeat;
}
