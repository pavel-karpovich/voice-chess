import { ContextManager } from './struct/context/contextManager';
import { ConversationData } from '../storage/conversationData';
import { LongStorageData } from '../storage/longStorageData';
import { Answer as Ans } from '../locales/answer';
import { Ask } from '../locales/ask';
import { HandlerBase } from './struct/handlerBase';
import { MoveHandlers } from './private/move';
import { SettingsHandlers } from './private/settings';
import { InfoHandlers } from './private/info';
import { GameHandlers } from './private/game';
import { NavigationHandlers } from './private/naviagation';

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
    InfoHandlers.load(response, contextManager, shortStorage, longStorage, endConv);
    SettingsHandlers.load(response, contextManager, shortStorage, longStorage, endConv);
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

  // -------------------- PUBLIC HANDLERS --------------------

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

  static help(): void {
    if (this.contexts.get('game')) {
      this.speak(Ask.ingameTips());
    } else {
      this.speak(Ask.nogameTips());
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
    SettingsHandlers.directToNextLogicalAction();
  }

  static newGame = GameHandlers.newGame;
  static continueGame = GameHandlers.continueGame;
  static resign = GameHandlers.resign;

  static next = NavigationHandlers.next;
  static yes = NavigationHandlers.yes;
  static no = NavigationHandlers.no;

  static difficulty = SettingsHandlers.difficulty;
  static modifyDifficulty = SettingsHandlers.modifyDifficulty;
  static enableConfirm = SettingsHandlers.enableConfirm;
  static disableConfirm = SettingsHandlers.disableConfirm;

  static turn = MoveHandlers.turn;
  static promotion = MoveHandlers.promotion;
  static chooseSide = MoveHandlers.chooseSide;
  static moveAuto = MoveHandlers.moveAuto;
  static castling = MoveHandlers.castling;
  static correct = MoveHandlers.correct;
  static chooseCastling = MoveHandlers.chooseCastling;
  static acceptAdvice = MoveHandlers.acceptAdvice;
  static advice = MoveHandlers.advice;

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

}
