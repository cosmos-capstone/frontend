// types/types.ts
export interface Node {
  id: string;
  date: Date;
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
  value?: number;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type: 'buy' | 'sell';
}

export interface Block {
  date: Date;
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
  date: Date;
  state: AssetState;
  previousState?: AssetState;
}