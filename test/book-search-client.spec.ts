import axios, { AxiosError, AxiosHeaders } from 'axios';
import BookSellerExampleApiClient from '../src/client/book-seller-example-api-client';
import BookSearchRequestError from '../src/client/book-search-request-error';
import BookSearchServerError from '../src/client/book-search-server-error';
import BookSearchConfig from '../src/book-search-config';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

function getAxiosErrorWithStatus(status: number) {
  const headers = new AxiosHeaders();
  const config = {
    headers,
  };
  const error = new AxiosError(
    '',
    '',
    config,
    {},
    {
      status,
      data: {},
      statusText: '',
      config,
      headers,
    }
  );
  error.status = status;
  return error;
}
describe('users API client', () => {
  const config = new BookSearchConfig();
  it('should get book response', async () => {
    const books = [
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
      },
    ];

    const mockedResponse = {
      data: books,
      status: 200,
      statusText: 'OK',
      headers: {},
    };

    mockedAxios.get.mockResolvedValueOnce(mockedResponse);

    const bookSellerExampleApiClient = new BookSellerExampleApiClient(config);
    const booksByShakespear = await bookSellerExampleApiClient.getBooks('Shakespear', 10);
    const params = {
      params: {
        format: 'json',
        limit: 10,
        q: 'Shakespear',
      },
    };
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `http://api.book-seller-example.com/by-author`,
      params
    );
    expect(booksByShakespear).toEqual(books);
  });

  it('should respond with Request Exception if receving a 404 from the api call', async () => {
    mockedAxios.get.mockImplementation(() => {
      const error = getAxiosErrorWithStatus(404);
      throw error;
    });

    const bookSellerExampleApiClient = new BookSellerExampleApiClient(config);
    expect(async () => {
      await bookSellerExampleApiClient.getBooks('Shakespear', 10);
    }).rejects.toThrowError(BookSearchRequestError);
  });

  it('should respond with Api Client Exception if receving a server error from the client ', async () => {
    mockedAxios.get.mockImplementation(() => {
      const error = getAxiosErrorWithStatus(500);
      throw error;
    });

    const bookSellerExampleApiClient = new BookSellerExampleApiClient(config);
    expect(async () => {
      await bookSellerExampleApiClient.getBooks('Shakespear', 10);
    }).rejects.toThrowError(BookSearchServerError);
  });
});
