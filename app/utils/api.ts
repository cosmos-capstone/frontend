import { TransactionResponseItem } from '../types/transactionResponseItem';
import { Transaction } from '../types/transaction';

export async function fetchTransactions(setExistingTransactions: (transactions: Transaction[]) => void) {
    const res = await fetch("https://cosmos-backend.cho0h5.org/transaction/test");
    const data = await res.json() as { data: TransactionResponseItem[] };
    const sortedData = data.data.map((item: TransactionResponseItem) => ({
        ...item,
        transaction_date: new Date(item.transaction_date)
    })).sort((a: Transaction, b: Transaction) => a.transaction_date.getTime() - b.transaction_date.getTime());
    setExistingTransactions(sortedData);
}