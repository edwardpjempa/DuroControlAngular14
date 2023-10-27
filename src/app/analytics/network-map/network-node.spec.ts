import { NetworkNode } from './network-node';

describe('NetworkNode', () => {
  it('should create an instance', () => {
    expect(new NetworkNode(0, 0, 0)).toBeTruthy();
  });
});
