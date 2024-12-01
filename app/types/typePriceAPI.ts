export interface StockPrice {
    datetime: string;
    close_price: string;
  }
  
 export interface StockData {
    name: string;
    currency: string;
    data: StockPrice[];
  }
  
  export interface StockPriceData {
    name: string;
    currency: string;
    data: {
      datetime: string;
      close_price: string;
    }[];
  }