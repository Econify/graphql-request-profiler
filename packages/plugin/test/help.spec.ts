import { helpText } from '../src/help';

describe('help', () => {
  it('returns a string', async () => {
    expect(typeof (await helpText())).toBe('string');
  });
});
