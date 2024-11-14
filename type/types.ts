// types/types.ts
export interface Transaction {
  id: number;
  transaction_date: string;
  transaction_type: 'deposit' | 'buy' | 'sell';
  asset_category: string | null;
  asset_symbol: string | null;
  asset_name: string | null;
  quantity: number;
  transaction_amount: string;
}

export interface Node {
  id: string;
  date: string;
  amount: number;
  asset_symbol: string;
  position: {
    x_position: number;
    y_position: number;
  };
  type: 'deposit' | 'american_stock' | 'korean_stock';
  action: 'buy' | 'sell';
  state: 'before' | 'after';
  size: {
    width: number;
    height: number;
  };
}
export interface Edge {
  id: string;
  source: string;
  target: string;
  type: 'buy' | 'sell';
}

export interface Block {
  date: string;
  position: {
    x_position: number;
    width: number;
    height: number;
  };
  beforeNodes: Node[];
  afterNodes: Node[];
}

export interface AssetState {
  cash: number;
  holdings: {
    [symbol: string]: number;
  };
}

export interface AssetHistory {
  date: string;
  state: AssetState;
  previousState?: AssetState;
}
