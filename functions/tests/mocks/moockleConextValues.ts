import { Context, ContextParams, } from "../../src/handlers/struct/context/contextManager";

export class MoockleContextValues {

  conte: Map<string, Context>;

  constructor() {
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
  delete(name: string): void {
    this.conte.delete(name);
  }

}