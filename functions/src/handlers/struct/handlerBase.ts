import { ContextManager } from './context/contextManager';
import { ConversationData } from '../../storage/conversationData';
import { LongStorageData } from '../../storage/longStorageData';

export class HandlerBase {
  protected static speak: (msg: string) => void;
  protected static end: (endMsg: string) => void;

  protected static contexts: ContextManager;
  protected static short: ConversationData;
  protected static long: LongStorageData;

  static load(
    response: (msg: string) => void,
    contextManager: ContextManager,
    shortStorage: ConversationData,
    longStorage: LongStorageData,
    endConv?: (msg: string) => void
  ) {
    this.speak = response;
    this.contexts = contextManager;
    this.short = shortStorage;
    this.long = longStorage;
    this.end = endConv || this.speak;
  }
}
