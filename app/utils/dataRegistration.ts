import { ChangeEvent } from 'react';
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

export const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLSelectElement>, setNewTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>) => {
    const { name, value } = event.target;
    setNewTransactions((prev) => {
        const updatedTransactions = [...prev];
        updatedTransactions[index] = {
            ...updatedTransactions[index],
            [name]: name === "quantity" || name === "transaction_amount"
                ? Number(value)
                : name === "transaction_date"
                    ? new Date(value)
                    : value,
            ...(name === "transaction_type" && (value === "deposit" || value === "withdrawal") ? { asset_category: "cash" } : {}),
        };
        return updatedTransactions;
    });
};
