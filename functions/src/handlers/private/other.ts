import { HandlerBase } from '../struct/handlerBase';
import { Answer as Ans } from '../../locales/answer';
import { Ask } from '../../locales/ask';
import { SettingsHandlers } from './settings';

export class OtherHandlers extends HandlerBase {
  static help(): void {
    if (this.contexts.get('game')) {
      this.speak(Ask.ingameTips());
    } else {
      this.speak(Ask.nogameTips());
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
}
