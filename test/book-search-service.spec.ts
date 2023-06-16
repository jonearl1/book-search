import BookSearchService from '../src/service/book-search-service';
import BookSearchApiClient from '../src/client/book-search-api-client';
import BookReponse from '../src/client/book-response-type';
import BookSearchConfig from '../src/book-search-config';

function apiClientWithGetBooksResponse(response: any, config: BookSearchConfig) {
  return new (class extends BookSearchApiClient {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getBooks(_authorName: string, _limit: number) {
      return response;
    }
  })(config);
}

describe('BookSearchService ', () => {
  const config = new BookSearchConfig();
  describe('Json Request', () => {
    it('should transform book response', async () => {
      const bookSearchApiClient = apiClientWithGetBooksResponse(
        [
          {
            book: {
              title: 'book1',
              author: 'Shakespear',
              isbn: '001',
            },
            stock: {
              quantity: 1,
              price: 1.0,
            },
          } as BookReponse,
        ],
        config
      );

      const bookService = new BookSearchService(bookSearchApiClient, config);

      const booksByShakespear = await bookService.getBooksByAuthor('Shakespear', 10);
      expect(booksByShakespear).toEqual([
        {
          title: 'book1',
          author: 'Shakespear',
          isbn: '001',
          quantity: 1,
          price: 1.0,
        },
      ]);
    });
  });

  describe('Xml Request', () => {
    it('should transform book response', async () => {
      config.format = 'xml';
      const bookSearchApiClient = apiClientWithGetBooksResponse(
        '<?xml version="1.0" encoding="UTF-8" ?>\n' +
          '<books>\n' +
          '    <book>\n' +
          '        <bookDetails>\n' +
          '            <title>book1</title>\n' +
          '            <author>Shakespear</author>\n' +
          '            <isbn>001</isbn>\n' +
          '        </bookDetails>\n' +
          '        <stockDetails>\n' +
          '            <quantity>1</quantity>\n' +
          '            <price>1.0</price>\n' +
          '        </stockDetails>\n' +
          '    </book>\n' +
          '    <book>\n' +
          '        <bookDetails>\n' +
          '            <title>book2</title>\n' +
          '            <author>Shakespear</author>\n' +
          '            <isbn>002</isbn>\n' +
          '        </bookDetails>\n' +
          '        <stockDetails>\n' +
          '            <quantity>2</quantity>\n' +
          '            <price>2.0</price>\n' +
          '        </stockDetails>\n' +
          '    </book>\n' +
          '</books>',
        config
      );
      const bookService = new BookSearchService(bookSearchApiClient, config);

      const booksByShakespear = await bookService.getBooksByAuthor('Shakespear', 10);
      expect(booksByShakespear).toEqual([
        {
          title: 'book1',
          author: 'Shakespear',
          isbn: '001',
          quantity: 1,
          price: 1.0,
        },
        {
          title: 'book2',
          author: 'Shakespear',
          isbn: '002',
          quantity: 2,
          price: 2.0,
        },
      ]);
    });
  });
});
