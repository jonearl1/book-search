import BookSearchConfig from '../book-search-config';
import BookReponse from './book-response-type';

export default abstract class BookSearchApiClient {
  config: BookSearchConfig;

  constructor(config: BookSearchConfig) {
    this.config = config;
  }

  abstract getBooks(authorName: string, limit: number): Promise<BookReponse[]>;
}
