import axios from 'axios';

export default class BookSearchApiClient {
  format: string;

  constructor(format: string) {
    this.format = format;
  }

  async getBooksByAuthor(authorName: string, limit: any) {
    let result: never[] = [];

    const options = {
      method: 'GET',
      url: `http://api.book-seller-example.com/by-author?q=${authorName}&limit=${limit}&format=${this.format}`,
    };

    const response = await axios.request(options);
    if (response.status === 200) {
      if (this.format === 'json') {
        const json = JSON.parse(response.data);

        result = json.map(
          (item: {
            book: { title: any; author: any; isbn: any };
            stock: { quantity: any; price: any };
          }) => ({
            title: item.book.title,
            author: item.book.author,
            isbn: item.book.isbn,
            quantity: item.stock.quantity,
            price: item.stock.price,
          })
        );
      } else if (this.format === 'xml') {
        const xml = response.data;

        result = xml.documentElement.childNodes.map(
          (item: { childNodes: { childNodes: { nodeValue: any }[] }[] }) => ({
            title: item.childNodes[0].childNodes[0].nodeValue,
            author: item.childNodes[0].childNodes[1].nodeValue,
            isbn: item.childNodes[0].childNodes[2].nodeValue,
            quantity: item.childNodes[1].childNodes[0].nodeValue,
            price: item.childNodes[1].childNodes[1].nodeValue,
          })
        );
      }
      return result;
    }
    throw new Error(`Request failed.  Returned status of ${response.status}`);
  }
}
