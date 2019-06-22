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
    suggest: (...suggestions: string[]) => void,
    endConv?: (msg: string) => void
  ) {
    super.load(response, contextManager, shortStorage, longStorage, suggest, endConv);
    MoveHandlers.load(response, contextManager, shortStorage, longStorage, suggest, endConv);
    SettingsHandlers.load(response, contextManager, shortStorage, longStorage, suggest, endConv);
    InfoHandlers.load(response, contextManager, shortStorage, longStorage, suggest, endConv);
    GameHandlers.load(response, contextManager, shortStorage, longStorage, suggest, endConv);
    NavigationHandlers.load(response, contextManager, shortStorage, longStorage, suggest, endConv);
    AroundMoveHandlers.load(response, contextManager, shortStorage, longStorage, suggest, endConv);
    FallbackHandlers.load(response, contextManager, shortStorage, longStorage, suggest, endConv);
    OtherHandlers.load(response, contextManager, shortStorage, longStorage, suggest, endConv);
  }

  static newGame = GameHandlers.newGame.bind(GameHandlers);
  static continueGame = GameHandlers.continueGame.bind(GameHandlers);
  static resign = () => GameHandlers.resign();
  static welcome = GameHandlers.welcome.bind(GameHandlers);

  static next = NavigationHandlers.next.bind(NavigationHandlers);
  static yes = NavigationHandlers.yes.bind(NavigationHandlers);
  static no = NavigationHandlers.no.bind(NavigationHandlers);

  static difficulty = SettingsHandlers.difficulty.bind(SettingsHandlers);
  static modifyDifficulty = SettingsHandlers.modifyDifficulty.bind(SettingsHandlers);
  static enableConfirm = SettingsHandlers.enableConfirm.bind(SettingsHandlers);
  static disableConfirm = SettingsHandlers.disableConfirm.bind(SettingsHandlers);

  static turn = MoveHandlers.turn.bind(MoveHandlers);

  static promotion = AroundMoveHandlers.promotion.bind(AroundMoveHandlers);
  static chooseSide = AroundMoveHandlers.chooseSide.bind(AroundMoveHandlers);
  static moveAuto = AroundMoveHandlers.moveAuto.bind(AroundMoveHandlers);
  static castling = AroundMoveHandlers.castling.bind(AroundMoveHandlers);
  static correct = AroundMoveHandlers.correct.bind(AroundMoveHandlers);
  static chooseCastling = AroundMoveHandlers.chooseCastling.bind(AroundMoveHandlers);
  static acceptAdvice = AroundMoveHandlers.acceptAdvice.bind(AroundMoveHandlers);
  static advice = () => AroundMoveHandlers.advice();

  static showBoard = InfoHandlers.showBoard.bind(InfoHandlers);
  static secondPartOfBoard = InfoHandlers.secondPartOfBoard.bind(InfoHandlers);
  static rank = InfoHandlers.rank.bind(InfoHandlers);
  static nextRank = InfoHandlers.nextRank.bind(InfoHandlers);
  static prevRank = InfoHandlers.prevRank.bind(InfoHandlers);
  static listOfMoves = InfoHandlers.listOfMoves.bind(InfoHandlers);
  static history = InfoHandlers.history.bind(InfoHandlers);
  static square = InfoHandlers.square.bind(InfoHandlers);
  static piece = InfoHandlers.piece.bind(InfoHandlers);
  static all = InfoHandlers.all.bind(InfoHandlers);
  static captured = InfoHandlers.captured.bind(InfoHandlers);
  static side = InfoHandlers.side.bind(InfoHandlers);
  static fullmove = InfoHandlers.fullmove.bind(InfoHandlers);

  static fallback = FallbackHandlers.fallback.bind(FallbackHandlers);

  static help = OtherHandlers.help.bind(OtherHandlers);
  static silence = OtherHandlers.silence.bind(OtherHandlers);
  static repeat = OtherHandlers.repeat.bind(OtherHandlers);
}
