
export abstract class MockProto {
  static resetMockedData() {
    throw new Error('static method resetMockedData() is not implemented');
  }
  protected abstract initMock(): void;
}
