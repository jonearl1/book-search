type BookReponse = {
  book: BookDetails;
  stock: StockDetails;
};

type BookDetails = {
  title: string;
  author: string;
  isbn: string;
};

type StockDetails = {
  quantity: number;
  price: number;
};

export default BookReponse;
