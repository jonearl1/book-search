import { parseString } from 'xml2js';
import BookReponse from '../client/book-response-type';
import BookSearchApiClient from '../client/book-search-api-client';
import Book from './book-type';

export default class BookSearchService {
  format: string;

  bookSearchApiClient: BookSearchApiClient;

  constructor(format: string, apiClient: BookSearchApiClient) {
    this.format = format;
    this.bookSearchApiClient = apiClient;
  }

  async getBooksByAuthor(authorName: string, limit: number): Promise<Book[]> {
    const bookResponse = await this.bookSearchApiClient.getBooks(authorName, limit, this.format);

    let result: Book[] = [];
    if (this.format === 'json') {
      result = this.parseJson(bookResponse);
    } else if (this.format === 'xml') {
      result = this.parseXml(bookResponse);
    }
    return result;
  }

  private parseXml(bookResponse: BookReponse[]): Book[] {
    let result: Book[] = [];
    parseString(bookResponse, (_err, xml) => {
      result = xml.books.book.map(
        (item: { bookDetails: any; stockDetails: any }) =>
          ({
            title: item.bookDetails[0].title[0],
            author: item.bookDetails[0].author[0],
            isbn: item.bookDetails[0].isbn[0],
            quantity: parseInt(item.stockDetails[0].quantity[0], 10),
            price: parseFloat(item.stockDetails[0].price[0]),
          } as Book)
      );
    });
    return result;
  }

  private parseJson(json: BookReponse[]): Book[] {
    return json.map(
      (item: BookReponse) =>
        ({
          title: item.book.title,
          author: item.book.author,
          isbn: item.book.isbn,
          quantity: item.stock.quantity,
          price: item.stock.price,
        } as Book)
    );
  }
}
