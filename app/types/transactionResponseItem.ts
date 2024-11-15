export interface TransactionResponseItem {
  id: number;
  transaction_date: string; // ISO date string
  transaction_type: "deposit" | "withdrawal" | "buy" | "sell";
  asset_category: "korean_stock" | "american_stock" | "korean_bond" | "american_bond" | "fund" | "commodity" | "gold" | "deposit" | "savings" | "cash";
  asset_symbol?: string;
  asset_name?: string;
  quantity: number;
  transaction_amount: number;
}
