interface SubprocessMock { 
  stdout: { on: (event: string, listener: (data: string) => void) => void },
  stderr: { on: (event: string, listener: (data: string) => void) => void },
  stdin: { write: jest.Mock },
  on: (event: string, listener: (data: string) => void) => void,
  callStdout?: (data: string) => void,
  callStderr?: (data: string) => void,
};
let mockProc: SubprocessMock;
jest.mock('child_process', () => {
  return {
    spawn: function(path: string, args: string[], options: any) {
      const stdoutMock = jest.fn(
        function (event: string, listener: (data: string) => void) {
          mockProc.callStdout = listener;
        }
      );
      const stderrMock = jest.fn(
        function (this: SubprocessMock, event: string, listener: (data: string) => void) {
          mockProc.callStderr = listener;
        }
      );
      const stdinMock = jest.fn((message: string): void => {});
      mockProc = {
        stdout: { on: stdoutMock },
        stderr: { on: stderrMock },
        stdin: { write: stdinMock },
        on: jest.fn((err: string) => {}),
      };
      return mockProc;
    },
  };
});
import { StockfishEngine } from '../../../../src/chess/stockfish/engine';

describe('Test stockfish engine wrapper', () => {

  test('The engine creates correctly', () => {
    expect(() => {
      new StockfishEngine();
    }).not.toThrowError();
  });

  test('Message posted to subprocess', () => {
    const engine = new StockfishEngine();
    const msg = 'test_message';
    engine.postMessage(msg);
    expect(mockProc.stdin.write).toBeCalledWith(msg + '\n');
  });

  test('Return stdout messages can be received', () => {
    const engine = new StockfishEngine();
    engine.onmessage = jest.fn((message: string): void => {});
    const msg = 'stdout from subprocess';
    mockProc.callStdout(msg);
    expect(engine.onmessage).toHaveBeenLastCalledWith(msg);
  });

  test('Return stderr error messages can be received', () => {
    const engine = new StockfishEngine();
    engine.onmessage = jest.fn((message: string): void => {});
    const err = 'stderr from subprocess';
    mockProc.callStderr(err);
    expect(engine.onmessage).toHaveBeenLastCalledWith(err);
  });
});
