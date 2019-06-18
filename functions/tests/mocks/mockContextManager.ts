import { ContextManager, Context, ContextParams } from "../../src/handlers/struct/context/contextManager";

export class MockContextManager extends ContextManager {

  private conte: Map<string, Context>;

  constructor() {
    super();
    this.conte = new Map<string, Context>();
  }

  get(name: string): Context {
    return this.conte.get(name);
  }  
  set(name: string, lifespan: number, params?: ContextParams): void {
    this.conte.set(
      name,
      { name, lifespan, parameters: params }
    );
  }
  drop(name: string): boolean {
    return this.conte.delete(name);
  }
  is(name: string): boolean {
    return this.conte.has(name);
  }

}
