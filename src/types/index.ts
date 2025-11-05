export interface Trade {
    id: string;
    price: number;
    quantity: number;
    time: number;
    isBuyerMaker: boolean;
  }
  
  export interface OrderBookLevel {
    price: number;
    quantity: number;
  }
  
  export interface OrderBookData {
    bids: Map<number, number>;
    asks: Map<number, number>;
    lastUpdateId: number;
  }
  
  export interface OrderBookRowData {
    price: number;
    quantity: number;
    total: number;
  }