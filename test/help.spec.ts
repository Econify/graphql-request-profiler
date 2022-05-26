import { helpText } from '../help';

describe('help', () => {
  it('returns a string', () => {
    expect(typeof helpText()).toBe('string');
  });
});
