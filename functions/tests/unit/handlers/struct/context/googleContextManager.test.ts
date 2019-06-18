import { MoockleContextValues } from "../../../../mocks/moockleConextValues";
import { GoogleContextManager } from '../../../../../src/handlers/struct/context/googleContextManager';

describe('Tests for GoogleConextManager class', () => {

  test('Constructor take parameter', () => {
    const stub = new MoockleContextValues();
    const mngr = new GoogleContextManager(stub as any);
    expect(mngr).toBeDefined();
  });

  test('Set context', () => {
    const stub = new MoockleContextValues();
    const contexts = new GoogleContextManager(stub as any);
    const contextName = 'test';
    const contextLifespan = 3;
    const params = { par1: 42 };
    contexts.set(contextName, contextLifespan, params);
    expect(stub.conte.size).toBe(1);
  });

  test('Get existing context', () => {
    const stub = new MoockleContextValues();
    const contexts = new GoogleContextManager(stub as any);
    const contextName = 'test2';
    const contextLifespan = 4;
    contexts.set(contextName, contextLifespan);
    const cont = contexts.get(contextName);
    expect(cont).toBeDefined();
    expect(cont.name).toBe(contextName);
    expect(cont.lifespan).toBe(contextLifespan);
  });

  test('Getting the non existing context', () => {
    const stub = new MoockleContextValues();
    const contexts = new GoogleContextManager(stub as any);
    const contextName = 'test2';
    const wrongName = 'ratata';
    const contextLifespan = 4;
    contexts.set(contextName, contextLifespan);
    const cont = contexts.get(wrongName);
    expect(cont).toBeNull();
  });

  test('Dropping of existing context', () => {
    const stub = new MoockleContextValues();
    const contexts = new GoogleContextManager(stub as any);
    const contextName = 'te4';
    const contextLifespan = 1;
    contexts.set(contextName, contextLifespan);
    const isDrop = contexts.drop(contextName);
    expect(isDrop).toBeTruthy();
    expect(stub.conte.size).toBe(0);
  });
  
  test('Dropping the non existing context', () => {
    const stub = new MoockleContextValues();
    const contexts = new GoogleContextManager(stub as any);
    const contextName = 'cont007';
    const wrongName = 'monty008';
    const contextLifespan = 24;
    contexts.set(contextName, contextLifespan);
    const isDrop = contexts.drop(wrongName);
    expect(isDrop).toBeFalsy();
    expect(stub.conte.size).toBe(1);
  });

  test('Positive context presence check', () => {
    const stub = new MoockleContextValues();
    const contexts = new GoogleContextManager(stub as any);
    const contextName = 'ctx';
    const contextLifespan = 2;
    contexts.set(contextName, contextLifespan);
    const isIt = contexts.is(contextName);
    expect(isIt).toBeTruthy();
  });
  
  test('Negative context presence check', () => {
    const stub = new MoockleContextValues();
    const contexts = new GoogleContextManager(stub as any);
    const contextName = 'ctx';
    const isIt = contexts.is(contextName);
    expect(isIt).toBeFalsy();
  });

});
