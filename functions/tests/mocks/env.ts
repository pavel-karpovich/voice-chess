import { MockContextManager } from './mockContextManager';
import { ConversationData } from '../../src/storage/conversationData';
import { LongStorageData } from '../../src/storage/longStorageData';

export class Env {

  output: string[];
  isEnd: boolean;
  contexts: MockContextManager;
  convData: ConversationData;
  userStorage: LongStorageData;
  suggestions: string[];

  constructor() {
    this.resetMockedData();
  }

  resetMockedData() {
    this.output = [];
    this.isEnd = false;
    this.contexts = new MockContextManager();
    this.convData = {};
    this.userStorage = {};
    this.suggestions = [];
    this.toOutput.mockClear();
    this.addSuggestions.mockClear();
    this.endConversation.mockClear();
  }

  toOutput = jest.fn((str: string) => {
    if (this.output.length === 2) {
      throw new Error('Must be maximum 2 output messages!');
    }
    this.output.push(str);
  });

  addSuggestions = jest.fn((...suggestions: string[]) => {
    for (const sug of suggestions) {
      if (sug.length > 25) {
        throw new Error(`Suggestion "${sug}" exceeded the maximum length of 25 characters!`);
      }
    }
    this.suggestions.push(...suggestions);
    if (this.suggestions.length > 8) {
      throw new Error('Must be maximum 8 suggestion chips!');
    }
  });

  endConversation = jest.fn((str: string) => {
    if (this.output.length === 2) {
      throw new Error('Must be maximum 2 output messages!');
    }
    this.output.push(str);
    this.isEnd = true;
  });

}