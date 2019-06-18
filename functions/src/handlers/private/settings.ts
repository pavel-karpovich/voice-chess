import { HandlerBase } from "../struct/handlerBase";
import { Answer as Ans } from '../../locales/answer';
import { Ask } from "../../locales/ask";
import { maxDifficulty } from "../../chess/chess";

export class SettingsHandlers extends HandlerBase {

  static safeGameContext(): void {
    const gameContext = this.contexts.get('game');
    if (gameContext) {
      this.contexts.set('game', gameContext.lifespan + 1);
    }
  }
  
  static directToNextLogicalAction(): void {
    const gameContext = this.contexts.get('game');
    if (gameContext) {
      this.speak(Ask.waitMove());
      this.contexts.set('turn-intent', 1);
    } else {
      this.speak(Ask.askToNewGame());
      this.contexts.set('ask-to-new-game', 1);
    }
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

}