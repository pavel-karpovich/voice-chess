import { ContextManager } from "../../../../src/handlers/struct/context/contextManager";
import { MockContextManager } from "../../../mocks/mockContextManager";
import { ConversationData } from "../../../../src/storage/conversationData";
import { LongStorageData } from "../../../../src/storage/longStorageData";

export class Env {

  output: string[];
  isEnd: boolean;
  contexts: ContextManager;
  convData: ConversationData;
  userStorage: LongStorageData;

  constructor() {
    this.output = [];
    this.isEnd = false;
    this.contexts = new MockContextManager();
    this.convData = {};
    this.userStorage = {};
  }

  toOutput(str: string): void {
    if (this.output.length === 2) {
      throw new Error('Must be maximum 2 output messages');
    }
    this.output.push(str);
  }

  endConversation(str: string): void {
    if (this.output.length === 2) {
      throw new Error('Must be maximum 2 output messages');
    }
    this.output.push(str);
    this.isEnd = true;
  }

}