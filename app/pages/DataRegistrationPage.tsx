import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';

interface Transaction {
  transaction_date: string;
  transaction_type: "deposit" | "withdrawal" | "buy" | "sell";
  asset_category: "korean_stock" | "american_stock" | "korean_bond" | "american_bond" | "fund" | "commodity" | "gold" | "deposit" | "savings";
  stock_code?: string;
  stock_name?: string;
  bond_name?: string;
  fund_name?: string;
  quantity: number;
  transaction_amount: number;
}

export default function TradePage() {
  const [existingTransactions, setExistingTransactions] = useState<Transaction[]>([]);
  const [newTransactions, setNewTransactions] = useState<Transaction[]>([
    {
      transaction_date: "",
      transaction_type: "buy",
      asset_category: "korean_stock",
      stock_code: "",
      stock_name: "",
      bond_name: "",
      fund_name: "",
      quantity: 0,
      transaction_amount: 0,
    },
  ]);

  useEffect(() => {
    async function fetchTransactions() {
      const res = await fetch("https://cosmos-backend.cho0h5.org/transaction/dumpdata1");
      const data = await res.json();
      setExistingTransactions(data.data);
    }
    fetchTransactions();
  }, []);

  const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setNewTransactions((prev) => {
      const updatedTransactions = [...prev];
      updatedTransactions[index] = {
        ...updatedTransactions[index],
        [name]: name === "quantity" || name === "transaction_amount" ? Number(value) : value,
      };
      return updatedTransactions;
    });
  };

  const addRow = () => {
    setNewTransactions([
      ...newTransactions,
      {
        transaction_date: "",
        transaction_type: "buy",
        asset_category: "korean_stock",
        stock_code: "",
        stock_name: "",
        bond_name: "",
        fund_name: "",
        quantity: 0,
        transaction_amount: 0,
      },
    ]);
  };

  const removeRow = (index: number) => {
    setNewTransactions(newTransactions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const res = await fetch("/api/submitTransactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransactions),
    });
    if (res.ok) {
      alert("거래 내역이 성공적으로 저장되었습니다.");
      const updatedTransactions = await res.json();
      setExistingTransactions([...existingTransactions, ...newTransactions]); // 기존 내역에 추가된 내역 반영
      setNewTransactions([
        {
          transaction_date: "",
          transaction_type: "buy",
          asset_category: "korean_stock",
          stock_code: "",
          stock_name: "",
          bond_name: "",
          fund_name: "",
          quantity: 0,
          transaction_amount: 0,
        },
      ]); // 폼 초기화
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">거래 내역 관리</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Transactions</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-700">
              <th className="border-b py-2">Date</th>
              <th className="border-b py-2">Type</th>
              <th className="border-b py-2">Category</th>
              <th className="border-b py-2">Stock Code</th>
              <th className="border-b py-2">Stock Name</th>
              <th className="border-b py-2">Bond Name</th>
              <th className="border-b py-2">Fund Name</th>
              <th className="border-b py-2">Quantity</th>
              <th className="border-b py-2">Amount</th>
              <th className="border-b py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Existing Transactions */}
            {existingTransactions.map((transaction, index) => (
              <tr key={index} className="text-gray-600">
                <td className="border-b py-2">{transaction.transaction_date}</td>
                <td className="border-b py-2">{transaction.transaction_type}</td>
                <td className="border-b py-2">{transaction.asset_category}</td>
                <td className="border-b py-2">{transaction.stock_code || "-"}</td>
                <td className="border-b py-2">{transaction.stock_name || "-"}</td>
                <td className="border-b py-2">{transaction.bond_name || "-"}</td>
                <td className="border-b py-2">{transaction.fund_name || "-"}</td>
                <td className="border-b py-2">{transaction.quantity}</td>
                <td className="border-b py-2">{transaction.transaction_amount}</td>
                <td className="border-b py-2">-</td>
              </tr>
            ))}

            {/* New Transactions */}
            {newTransactions.map((transaction, index) => (
              <tr key={index} className="text-gray-600 bg-gray-50">
                <td className="border-b py-2">
                  <input
                    type="datetime-local"
                    name="transaction_date"
                    value={transaction.transaction_date}
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
                    className="w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                {/* Add other fields for stock_code, stock_name, bond_name, etc. */}
                <td className="border-b py-2">
                  <input
                    type="text"
                    name="stock_code"
                    value={transaction.stock_code || ""}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="border-b py-2">
                  <input
                    type="text"
                    name="stock_name"
                    value={transaction.stock_name || ""}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="border-b py-2">
                  <input
                    type="text"
                    name="bond_name"
                    value={transaction.bond_name || ""}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="border-b py-2">
                  <input
                    type="text"
                    name="fund_name"
                    value={transaction.fund_name || ""}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="border-b py-2">
                  <input
                    type="number"
                    name="quantity"
                    value={transaction.quantity}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
      </div>
    </div>
  );
}