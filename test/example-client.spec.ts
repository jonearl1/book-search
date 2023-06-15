import BookSearchApiClient from '../src/BookSearchApiClient';

describe('BookSearch', () => {
  it('should get books by shakespear', async () => {
    const client = new BookSearchApiClient('json');
    const booksByShakespear = client.getBooksByAuthor('Shakespear', 10);
    console.log(booksByShakespear);
  });
});
