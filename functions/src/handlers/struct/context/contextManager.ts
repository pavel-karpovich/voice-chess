export interface Params {
  // tslint:disable-next-line: ban-types
  [param: string]: string | Object | undefined;
}

export interface Context {
  name: string;
  lifespan: number;
  parameters?: Params;
}

export abstract class ContextManager {
  abstract get(name: string): Context;
  abstract set(name: string, lifespan: number, params?: Params): void;
  abstract drop(name: string): boolean;
  abstract is(name: string): boolean;
}
