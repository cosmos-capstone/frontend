import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import Select from 'react-select';

interface Transaction {
  id: number;
  transaction_date: Date;
  transaction_type: "deposit" | "withdrawal" | "buy" | "sell";
  asset_category: "korean_stock" | "american_stock" | "korean_bond" | "american_bond" | "fund" | "commodity" | "gold" | "deposit" | "savings" | "cash";
  asset_symbol?: string;
  asset_name?: string;
  quantity: number;
  transaction_amount: number;
}

interface StockListElement {
  value: string;
  label: string;
}

export default function TradePage() {
  const [existingTransactions, setExistingTransactions] = useState<Transaction[]>([]);
  const [newTransactions, setNewTransactions] = useState<Transaction[]>([createEmptyTransaction()]);
  const [koreanStocks, setKoreanStocks] = useState<StockListElement[]>([]);
  const [americanStocks, setAmericanStocks] = useState<StockListElement[]>([]);

  useEffect(() => {
    fetchTransactions();
    fetchStockData("korean_stocks", setKoreanStocks);
    fetchStockData("american_stocks", setAmericanStocks);
  }, []);

  async function fetchTransactions() {
    const res = await fetch("https://cosmos-backend.cho0h5.org/transaction/test");
    const data = await res.json();
    const sortedData = data.data.map((item: any) => ({
      ...item,
      transaction_date: new Date(item.transaction_date)
    })).sort((a: Transaction, b: Transaction) => a.transaction_date.getTime() - b.transaction_date.getTime());
    setExistingTransactions(sortedData);
  }

  async function fetchStockData(endpoint: string, setState: (data: StockListElement[]) => void) {
    const res = await fetch(`https://cosmos-backend.cho0h5.org/market_data/${endpoint}`);
    const data = await res.json();
    const transformedData = data.data.map((stock: any) => ({ label: stock.name, value: stock.symbol }));
    setState(transformedData);
  }

  const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const addRow = () => {
    setNewTransactions([...newTransactions, createEmptyTransaction()]);
  };

  const removeRow = (index: number) => {
    setNewTransactions(newTransactions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const res = await fetch("https://cosmos-backend.cho0h5.org/transaction/test", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransactions.map(transaction => ({
        ...transaction,
        transaction_date: formatDateForInput(transaction.transaction_date)
      }))),
    });
    if (res.ok) {
      handleSuccessfulSubmit();
    } else {
      const response = await res.json();
      alert("거래 내역 저장을 실패했습니다.\nError: " + response.error);
    }
  };

  async function handleSuccessfulSubmit() {
    alert("거래 내역이 성공적으로 저장되었습니다.");
    await fetchTransactions();
    setNewTransactions([createEmptyTransaction()]);
  }

  const handleDeleteExistingTransaction = async (index: number) => {
    const transactionId = existingTransactions[index].id;
    const res = await fetch(`https://cosmos-backend.cho0h5.org/transaction/test?id=${transactionId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setExistingTransactions((prev) => prev.filter((_, i) => i !== index));
      alert("거래 내역이 성공적으로 삭제되었습니다.");
    } else {
      const response = await res.json();
      alert("거래 내역 삭제를 실패했습니다.\n" + response.error);
    }
  };

  const handleAssetNameChange = (index: number, selectedOption: StockListElement | null) => {
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

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">거래 내역 관리</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Transactions</h3>
        <TransactionTable
          existingTransactions={existingTransactions}
          newTransactions={newTransactions}
          handleInputChange={handleInputChange}
          handleAssetNameChange={handleAssetNameChange}
          removeRow={removeRow}
          handleDeleteExistingTransaction={handleDeleteExistingTransaction}
          koreanStocks={koreanStocks}
          americanStocks={americanStocks}
        />
        <ActionButtons
          addRow={addRow}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

function createEmptyTransaction(): Transaction {
  return {
    id: -1,
    transaction_date: new Date(),
    transaction_type: "buy",
    asset_category: "korean_stock",
    asset_symbol: "",
    asset_name: "",
    quantity: 0,
    transaction_amount: 0,
  };
}

const formatDateForInput = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const TransactionTable = ({
  existingTransactions,
  newTransactions,
  handleInputChange,
  handleAssetNameChange,
  removeRow,
  handleDeleteExistingTransaction,
  koreanStocks,
  americanStocks
}: any) => (
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className="text-gray-700">
        <th className="border-b py-2">Date</th>
        <th className="border-b py-2">Type</th>
        <th className="border-b py-2">Category</th>
        <th className="border-b py-2">Asset Name</th>
        <th className="border-b py-2">Quantity</th>
        <th className="border-b py-2">Amount</th>
        <th className="border-b py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {/* Existing Transactions */}
      {existingTransactions.map((transaction, index) => (
        <tr key={index} className="text-gray-600">
          <td className="border-b py-2">
            {transaction.transaction_date.toLocaleString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false // Uses 24-hour format
            })}
          </td>
          <td className="border-b py-2">{transaction.transaction_type}</td>
          <td className="border-b py-2">{transaction.asset_category}</td>
          <td className="border-b py-2">{transaction.asset_name}</td>
          <td className="border-b py-2">{transaction.quantity}</td>
          <td className="border-b py-2">{transaction.transaction_amount}</td>
          <td className="border-b py-2">
            <button
              type="button"
              onClick={() => handleDeleteExistingTransaction(index)}
              className="text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          </td>
        </tr>
      ))}

      {/* New Transactions */}
      {newTransactions.map((transaction, index) => (
        <tr key={index} className="text-gray-600 bg-gray-50">
          <td className="border-b py-2">
            <input
              type="datetime-local"
              name="transaction_date"
              value={formatDateForInput(transaction.transaction_date)}
              onChange={(e) => handleInputChange(index, e)}
              className="w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </td>
          <td className="border-b py-2">
            <select
              name="transaction_type"
              value={transaction.transaction_type}
              onChange={(e) => handleInputChange(index, e)}
              className="w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </td>
          <td className="border-b py-2">
            <select
              name="asset_category"
              value={transaction.asset_category}
              onChange={(e) => handleInputChange(index, e)}
              className={`w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${transaction.transaction_type === "deposit" || transaction.transaction_type === "withdrawal"
                ? "bg-gray-200 opacity-60 cursor-not-allowed"
                : ""
                }`}
              disabled={transaction.transaction_type === "deposit" || transaction.transaction_type === "withdrawal"}
              required
            >
              <option value="korean_stock">Korean Stock</option>
              <option value="american_stock">American Stock</option>
              <option value="korean_bond">Korean Bond</option>
              <option value="american_bond">American Bond</option>
              <option value="commodity">Commodity</option>
              <option value="gold">Gold</option>
              <option value="deposit">Deposit</option>
              <option value="savings">Savings Account</option>
            </select>
          </td>
          <td className="border-b py-2">
            {(transaction.asset_category !== "korean_stock" && transaction.asset_category !== "american_stock") && (
              <input
                type="text"
                name="asset_name"
                value={transaction.asset_name || ""}
                onChange={(e) => handleInputChange(index, e)}
                className={`w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${transaction.transaction_type === "deposit" || transaction.transaction_type === "withdrawal"
                  ? "bg-gray-200 opacity-60 cursor-not-allowed"
                  : ""
                  }`}
                disabled={transaction.transaction_type === "deposit" || transaction.transaction_type === "withdrawal"}
              />
            )}

            {transaction.asset_category === "korean_stock" && (
              <Select
                options={koreanStocks}
                onChange={(selectedOption) => handleAssetNameChange(index, selectedOption)}
                className="w-full"
              />
            )}
            {transaction.asset_category === "american_stock" && (
              <Select
                options={americanStocks}
                onChange={(selectedOption) => handleAssetNameChange(index, selectedOption)}
                className="w-full"
              />
            )}
          </td>
          <td className="border-b py-2">
            <input
              type="number"
              name="quantity"
              value={transaction.quantity}
              onChange={(e) => handleInputChange(index, e)}
              className={`w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${transaction.transaction_type === "deposit" || transaction.transaction_type === "withdrawal"
                ? "bg-gray-200 opacity-60 cursor-not-allowed"
                : ""
                }`}
              disabled={transaction.transaction_type === "deposit" || transaction.transaction_type === "withdrawal"}
              required
            />
          </td>
          <td className="border-b py-2">
            <input
              type="number"
              name="transaction_amount"
              value={transaction.transaction_amount}
              onChange={(e) => handleInputChange(index, e)}
              className="w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </td>
          <td className="border-b py-2">
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const ActionButtons = ({ addRow, handleSubmit }: any) => (
  <div className="flex space-x-4 mt-4">
    <button
      type="button"
      onClick={addRow}
      className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      행 추가
    </button>

    <button
      type="button"
      onClick={handleSubmit}
      className="py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
    >
      거래 내역 저장
    </button>
  </div>
)