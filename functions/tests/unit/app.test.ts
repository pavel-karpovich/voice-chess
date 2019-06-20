import { Dialogmock, DialogmockConversation } from '../mocks/dialogmock';
jest.doMock('actions-on-google', () => {
  return {
    dialogflow: function dialogflow<ConvData, LongStorage>() {
      return new Dialogmock<ConvData, LongStorage>();
    },
    DialogflowConversation: DialogmockConversation,
  };
});
import { Handlers } from '../../src/handlers/public';
// F***ly smartly cool thing
let lastMock: jest.SpyInstance;
jest.doMock('../../src/handlers/public', () => {
  return {
    Handlers: new Proxy(Handlers, {
      get(obj, prop) {
        const mock = jest.spyOn(obj, prop as any).mockImplementationOnce(() => {});
        lastMock = mock;
        return (obj as any)[prop];
      },
    }),
  };
});
import { app } from '../../src/app';
import { ConversationData } from '../../src/storage/conversationData';
import { LongStorageData } from '../../src/storage/longStorageData';
import * as InitLang from '../../src/locales/initLang';
import { ChessSide, CastlingType, WhoseSide } from '../../src/chess/chessUtils';

const mApp = app as unknown as Dialogmock<ConversationData, LongStorageData>;

describe('Test configured dialogflow application', () => {

  describe('Test middlewares', () => {

    test('Middlewere with locale initialization', () => {
      const mock = jest.spyOn(InitLang, 'initLanguage');
      mock.mockImplementationOnce(() => {});
      const locale = 'ru-RU';
      const lang = locale.slice(0, 2);
      mApp._locale = locale;
      mApp.middleware(1);
      expect(InitLang.initLanguage).lastCalledWith(lang);
    });

    test('Middleware with loading Handlers', () => {
      mApp.middleware(2);
      expect(Handlers.load).toBeCalledTimes(1);
    });

    const initFallback = 2;
    test.each([
      ['Yes', initFallback],
      ['Default Fallback Intent', initFallback],
      ['accept-advice', 0],
      ['moves-next', 0],
    ])('Reset fallback counter when intent is "%s"', (intent, expected) => {
      mApp._convData.fallbackCount = initFallback;
      mApp._intent = intent as string;
      const conv = mApp.middleware(3);
      expect(conv.data.fallbackCount).toBe(expected);
    });
  });

  describe('Tests Google Action intents', () => {

    beforeAll(() => {
      const allParams = {
        ord: '1',
        num: '1',
        from: 'from',
        to: 'to',
        piece: 'piece',
        piece2: 'piece2',
        side: ChessSide.WHITE,
        cast: CastlingType.KINGSIDE,
        cell: 'cell',
        movesNumber: '1',
        square: 'square',
        whose: WhoseSide.ENEMY,
      };
      mApp._parameters = allParams;
    });

    afterEach(() => {
      lastMock.mockReset();
    });

    test.each([
      ['Help', 'help'],
      ['Default Welcome Intent', 'welcome'],
      ['Default Fallback Intent', 'fallback'],
      ['New Game', 'newGame'],
      ['Continue Game', 'continueGame'],
      ['Board', 'firstPartOfBoard'],
      ['Board - next', 'secondPartOfBoard'],
      ['Rank', 'rank'],
      ['Rank - number', 'rank'],
      ['Rank - next', 'nextRank'],
      ['Rank - previous', 'prevRank'],
      ['Turn', 'turn'],
      ['Promotion', 'promotion'],
      ['Correct', 'correct'],
      ['Choose Side', 'chooseSide'],
      ['Auto move', 'moveAuto'],
      ['Castling', 'castling'],
      ['Choose Castling', 'chooseCastling'],
      ['Difficulty', 'difficulty'],
      ['Difficulty - number', 'modifyDifficulty'],
      ['Difficulty - full', 'modifyDifficulty'],
      ['Legal moves', 'listOfMoves'],
      ['History', 'history'],
      ['Enable confirm', 'enableConfirm'],
      ['Disable confirm', 'disableConfirm'],
      ['Advice', 'advice'],
      ['Accept Advice', 'acceptAdvice'],
      ['Square', 'square'],
      ['Piece', 'piece'],
      ['All', 'all'],
      ['Captured', 'captured'],
      ['Resign', 'resign'],
      ['Side', 'side'],
      ['Fullmove number', 'fullmove'],
      ['Next', 'next'],
      ['No', 'no'],
      ['Yes', 'yes'],
      ['Silence', 'silence'],
      ['Repeat', 'repeat'],
    ])('"%s" intent', (intent, handler) => {
      mApp.intent(intent);
      expect((Handlers as any)[handler]).toBeCalledTimes(1);
    });

  });

});
