export interface ContextParams {
  // tslint:disable-next-line: ban-types
  [param: string]: string | Object | undefined;
}

export interface Context {
  name: string;
  lifespan: number;
  parameters?: ContextParams;
}

export abstract class ContextManager {
  abstract get(name: string): Context;
  abstract set(name: string, lifespan: number, params?: ContextParams): void;
  abstract drop(name: string): void;
  abstract it(name: string): boolean;
}
