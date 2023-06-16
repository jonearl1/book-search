import axios, { AxiosError, AxiosResponse } from 'axios';
import BookSearchApiClient from './book-search-api-client';
import BookReponse from './book-response-type';
import BookSearchRequestError from './book-search-request-error';
import BookSearchServerError from './book-search-server-error';

export default class BookSellerExampleApiClient extends BookSearchApiClient {
  async getBooks(authorName: string, limit: number): Promise<BookReponse[]> {
    const response = await this.getBooksResponse(authorName, limit, this.config.format);
    return response.data;
  }

  private async getBooksResponse(
    authorName: string,
    limit: number,
    format: string
  ): Promise<AxiosResponse<BookReponse[]>> {
    const params = {
      q: authorName,
      limit,
      format,
    };
    let response: AxiosResponse;
    try {
      response = await axios.get<BookReponse[]>(this.config.bookSellerUrl, { params });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 404) {
          throw new BookSearchRequestError();
        } else if (error.status === 500) {
          throw new BookSearchServerError();
        }
      }
      throw error;
    }
    return response;
  }
}
