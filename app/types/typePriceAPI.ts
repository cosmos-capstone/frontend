export interface StockPrice {
    datetime: string;
    close_price: string;
  }
  
 export interface StockData {
    name: string;
    currency: string;
    data: StockPrice[];
  }
  