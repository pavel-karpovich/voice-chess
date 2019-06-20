import { ContextManager, Context, Params } from './contextManager';
import { Contexts } from 'actions-on-google';
import { ContextValues } from 'actions-on-google/dist/service/dialogflow/context';

export class GoogleContextManager extends ContextManager {
  private googleContexts: ContextValues<Contexts>;

  constructor(convContexts: ContextValues<Contexts>) {
    super();
    this.googleContexts = convContexts;
  }

  get(name: string): Context {
    if (this.is(name)) {
      return this.googleContexts.get(name);
    } else {
      return null;
    }
  }

  set(name: string, lifespan: number, params?: Params): void {
    this.googleContexts.set(name, lifespan, params);
  }

  drop(name: string): boolean {
    if (this.is(name)) {
      this.googleContexts.delete(name);
      return true;
    } else {
      return false;
    }
  }

  is(name: string): boolean {
    return !!this.googleContexts.get(name);
  }
}
