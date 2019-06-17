import { ContextManager, Context, ContextParams } from "./contextManager";
import { Contexts } from 'actions-on-google';
import { ContextValues } from "actions-on-google/dist/service/dialogflow/context";

export class GoogleContextManager extends ContextManager {

  private googleContexts: ContextValues<Contexts>;

  constructor(convContexts: ContextValues<Contexts>) {
    super();
    this.googleContexts = convContexts;
  }

  get(name: string): Context {
    return this.googleContexts.get(name);
  }

  set(name: string, lifespan: number, params: ContextParams): void {
    this.googleContexts.set(name, lifespan, params);
  }

  drop(name: string): void {
    this.googleContexts.delete(name);
  }

  it(name: string): boolean {
    return !!this.googleContexts.get(name);
  }
}