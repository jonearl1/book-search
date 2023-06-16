import BookReponse from './book-response-type';

export default abstract class BookSearchApiClient {
  abstract getBooks(authorName: string, limit: number, format: string): Promise<BookReponse[]>;
}
