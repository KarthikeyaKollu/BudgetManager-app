"use client";
import React, { useState, useEffect, useMemo } from "react";
import { fetchTransactions } from "@/redux/transactionSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useUser } from "@clerk/nextjs";
interface Transaction {
  _id: string;
  what: string;
  amount: number;
  category: string;
  subcategory: string;
  createdAt: string;
}

const categories = [
  {
    category: "Essential Expenses",
    subcategories: [
      { name: "Housing", icon: "🏠" },
      { name: "Transportation", icon: "🚗" },
      { name: "Food", icon: "🍔" },
      { name: "Utilities and Services", icon: "💡" },
      { name: "Healthcare", icon: "⚕️" },
      { name: "Insurance", icon: "📑" },
      { name: "Debt Repayments", icon: "💳" },
    ],
  },
  {
    category: "Non-Essential Expenses",
    subcategories: [
      { name: "Entertainment and Leisure", icon: "🎉" },
      { name: "Personal Care", icon: "💅" },
      { name: "Clothing and Accessories", icon: "👗" },
      { name: "Savings", icon: "💰" },
      { name: "Investments", icon: "📈" },
    ],
  },
  {
    category: "Miscellaneous",
    subcategories: [
      { name: "Education and Self-Improvement", icon: "🎓" },
      { name: "Gifts and Donations", icon: "🎁" },
      { name: "Miscellaneous", icon: "🛠️" },
    ],
  },
];

const TransactionList: React.FC = () => {

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("All");
   const [state, setState] = useState('loading')
  const { user } = useUser(); // Use useUser hook to get the user object
  const userId = user?.id;

  const dispatch = useDispatch<AppDispatch>();
  const { items: transactions, loading, error } = useSelector(
    (state: RootState) => state.transactions
  );

  useEffect(() => {
    const handleFetchTransactions = async () => {
      if (userId) {
        const resultAction = await dispatch(fetchTransactions(userId)); // Dispatch with userId

        // Check if the action was successful
        if (fetchTransactions.fulfilled.match(resultAction)) {
            
        } else {
          // alert('Failed to fetch transactions.');
        }
      } else {
        console.error("User ID is not available");
      }
    };

   

    handleFetchTransactions();
  }, [dispatch, userId]);

  // Helper function to format the date
  const formatTransactionDate = (dateString: string) => {
    const transactionDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday =
      transactionDate.toDateString() === today.toDateString();
    const isYesterday =
      transactionDate.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
    };

    return transactionDate.toLocaleDateString("en-US", options);
  };

  const filteredTransactions = useMemo(() => {
    // Check if transactions is an array and has elements
    if (!Array.isArray(transactions) || transactions.length === 0) {

      return []; // Return an empty array if transactions is not an array or is empty
    }

    return transactions.filter((transaction) => {
      if (selectedCategory !== "All" && selectedSubcategory === "All") {
        return categories
          .find((cat) => cat.category === selectedCategory)
          ?.subcategories.some((sub) => sub.name === transaction.subcategory);
      }
      if (selectedSubcategory !== "All") {
        return transaction.subcategory === selectedSubcategory;
      }
      return true;
    });
  }, [transactions, selectedCategory, selectedSubcategory]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory("All");
  };

  if (loading){  return <p>Loading transactions...</p>};
  if (error) return <p>Error: {error}</p>;

  return (
    <main>
      <section className="max-w-[414px] h-[1051px] bg-white rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] p-[22.5px]">
        <header className="flex justify-between items-center mb-5">
          <h1 className="text-black text-lg font-bold">Transactions</h1>
          <select
            className="pl-[9px] h-[25px] bg-white rounded-md border-2 border-[#005fe4] text-black text-sm font-normal"
            value={selectedCategory}
            onChange={(e) => handleCategoryClick(e.target.value)}
          >
            <option>All</option>
            {categories.map((cat) => (
              <option key={cat.category}>{cat.category}</option>
            ))}
          </select>
        </header>

        <div className="flex gap-[6px] w-full mb-5 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {["All", ...(selectedCategory === "All"
            ? categories.flatMap((cat) => cat.subcategories.map((sub) => sub.name))
            : categories.find((cat) => cat.category === selectedCategory)?.subcategories.map((sub) => sub.name) || []
          )].map((sub) => (
            <div
              key={sub}
              className={`p-[10px] h-[22px] rounded-[5px] border border-[#005fe4]/60 flex items-center justify-center cursor-pointer ${selectedSubcategory === sub ? "bg-[#005fe4] text-white" : "bg-white text-[#6f6f6f]"
                }`}
              onClick={() => setSelectedSubcategory(sub)}
            >
              <span className="text-xs font-normal">{sub}</span>
            </div>
          ))}
        </div>

       {   <div className="overflow-y-auto max-h-[600px]">
          <ul>
            {filteredTransactions.map((transaction, index) => (
              <li key={transaction._id} className="mb-6">
                {index === 0 ||
                  formatTransactionDate(filteredTransactions[index - 1].createdAt) !==
                  formatTransactionDate(transaction.createdAt) ? (
                  <p className="text-[#6f6f6f] text-sm font-normal mb-[20px]">
                    {formatTransactionDate(transaction.createdAt)}
                  </p>
                ) : null}

                <div className="flex items-center gap-4 w-full mb-[20px]">
                  <span className="text-4xl">
                    {categories
                      .flatMap((cat) => cat.subcategories)
                      .find((sub) => sub.name === transaction.subcategory)?.icon || "💼"}
                  </span>
                  <div className="flex-1">
                    <p className="text-black text-base font-medium">{transaction.what}</p>
                    <p className="text-[#6f6f6f] text-xs font-normal">{transaction.subcategory}</p>
                  </div>
                  <p className="text-[#6f6f6f] text-base font-normal">-₹{transaction.amount.toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>}
      </section>
    </main>
  );
};

export default TransactionList;
