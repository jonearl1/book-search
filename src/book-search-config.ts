import * as dotenv from 'dotenv';

dotenv.config();

export default class BookSearchConfig {
  format: string;

  bookSellerUrl: string;

  constructor() {
    this.format = process.env.BOOK_RESPONSE_FORMAT as string;
    this.bookSellerUrl = process.env.BOOK_SELLER_URL as string;
  }
}
