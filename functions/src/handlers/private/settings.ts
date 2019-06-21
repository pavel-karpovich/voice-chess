import { HandlerBase } from '../struct/handlerBase';
import { Answer as Ans } from '../../locales/answer';
import { Ask } from '../../locales/ask';
import { maxDifficulty } from '../../chess/chess';
import { OtherHandlers } from './other';

export class SettingsHandlers extends HandlerBase {
  static safeGameContext(): void {
    const gameContext = this.contexts.get('game');
    if (gameContext) {
      this.contexts.set('game', gameContext.lifespan + 1);
    }
  }

  static difficulty(): void {
    this.safeGameContext();
    const currentDifficulty = this.long.options.difficulty;
    this.speak(Ans.showDifficulty(currentDifficulty));
    this.speak(Ask.askToChangeDifficulty());
    this.suggest('0', '3', '6', '9', '12', '15', '18', '20');
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
    OtherHandlers.directToNextLogicalAction();
  }

  static enableConfirm(): void {
    this.long.options.confirm = true;
    this.speak(Ans.confirmEnabled());
    OtherHandlers.directToNextLogicalAction();
  }

  static disableConfirm(): void {
    this.long.options.confirm = false;
    this.speak(Ans.confirmDisabled());
    OtherHandlers.directToNextLogicalAction();
  }
}
