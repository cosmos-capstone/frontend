import { StockListElement } from '../types/stockListElement';
import { Transaction } from '../types/transaction';

export const handleAssetNameChange = (index: number, selectedOption: StockListElement | null, setNewTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>) => {
    console.info(selectedOption);
    setNewTransactions((prev) => {
        const updatedTransactions = [...prev];
        updatedTransactions[index] = {
            ...updatedTransactions[index],
            asset_name: selectedOption?.label || "",
            asset_symbol: selectedOption?.value || "",
        };
        return updatedTransactions;
    });
};