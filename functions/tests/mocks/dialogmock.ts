import { MoockleContextValues } from "./moockleConextValues";
import { Params } from "../../src/handlers/struct/context/contextManager";

interface Userock<LongData> {
  locale: string;
  storage: LongData;
}

export class DialogmockConversation<ConvData, LongData> {
  
  user: Userock<LongData>;
  data: ConvData;
  contexts: MoockleContextValues;
  intent: string;
  parameters: Params;

  constructor(
    locale: string,
    userStorage: LongData,
    data: ConvData,
    contexts: MoockleContextValues,
    intent: string,
    parameters: Params
  ) {
    this.user = {
      locale,
      storage: userStorage,
    };
    this.data = data;
    this.contexts = contexts;
    this.intent = intent;
    this.parameters = parameters;
  }

  ask = jest.fn((message: string) => {});
  close = jest.fn((message: string) => {});
  
}

const defaultLocale = 'en-EN';
const defaultIntent = 'Fallback';
const defaultParams = {};
export class Dialogmock<ConvData, LongData> {

  _locale: string;
  _userStorage: LongData;
  _convData: ConvData;
  _contexts: MoockleContextValues;
  _intent: string;
  _parameters: Params;

  constructor() {
    this.resetMockedData();
    this.intentMap = new Map<string, (conv?: DialogmockConversation<ConvData, LongData>) => void>();
    this.middlewareMap = new Map<number, (conv: DialogmockConversation<ConvData, LongData>) => void>();
  }

  resetMockedData(): void {
    this._locale = defaultLocale;
    this._userStorage = {} as any;
    this._convData = {} as any;
    this._contexts = new MoockleContextValues();
    this._intent = defaultIntent;
    this._parameters = defaultParams;
  }

  private createConv(): DialogmockConversation<ConvData, LongData> {
    return new DialogmockConversation<ConvData, LongData>(
      this._locale,
      this._userStorage,
      this._convData,
      this._contexts,
      this._intent,
      this._parameters
    );
  }

  private middlewareId = 1;
  private intentMap: Map<string, (conv?: DialogmockConversation<ConvData, LongData>) => void>;
  private middlewareMap: Map<number, (conv: DialogmockConversation<ConvData, LongData>) => void>;

  middleware = jest.fn((fn: ((conv: DialogmockConversation<ConvData, LongData>) => void) | number) => {
    if (typeof fn === 'number') {
      const conv = this.createConv();
      this.middlewareMap.get(fn)(conv);
      return conv;
    } else {
      this.middlewareMap.set(this.middlewareId, fn);
      this.middlewareId++;
      return null;
    }
  });
  intent = jest.fn((name: string, fn?: (conv?: DialogmockConversation<ConvData, LongData>) => void) => {
    if (!fn && this.intentMap.has(name)) {
      const conv = this.createConv();
      this.intentMap.get(name)(conv);
      return conv;
    } else {
      this.intentMap.set(name, fn);
      return null;
    }
  });

  
}