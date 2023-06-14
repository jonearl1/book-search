import NameService from '../src/name.service';

describe('Name Service', () => {
  it('should get names', async () => {
    expect(new NameService().getNames()).toEqual(['']);
  });
});
