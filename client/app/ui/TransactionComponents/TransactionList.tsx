"use client";
import React, { useState, useEffect, useMemo } from "react";
import { fetchTransactions } from "@/redux/transactionSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useUser } from "@clerk/nextjs";
import { useSession } from '@clerk/nextjs'

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
  const { user } = useUser(); // Use useUser hook to get the user object
  const userId = user?.id;
  const { session } = useSession();

  const dispatch = useDispatch<AppDispatch>();
  const { items: transactions, loading, error } = useSelector(
    (state: RootState) => state.transactions
  );

  useEffect(() => {
    const handleFetchTransactions = async () => {
      const token = await session?.getToken();
      if (userId) {
        const resultAction = await dispatch(fetchTransactions({
          userId: 'user_2nmuwjdJoMdWIlhRu6Xf5z34fB2',
          category: selectedCategory,
          subcategory: selectedSubcategory,
          token: token
        }));
        if (fetchTransactions.fulfilled.match(resultAction)) {
          // Success handling
        } else {
          console.error("Failed to fetch transactions.");
        }
      } else {
        console.error("User ID is not available");
      }
    };
    handleFetchTransactions();
  }, [dispatch, userId, selectedCategory, selectedSubcategory]);

  // Helper function to format the date
  const formatTransactionDate = (dateString: string) => {
    const transactionDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = transactionDate.toDateString() === today.toDateString();
    const isYesterday = transactionDate.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
    };
    return transactionDate.toLocaleDateString("en-US", options);
  };

  // Filter and group transactions by date
  const groupedTransactions = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) return {};

    // Filter transactions based on selected category and subcategory
    const filtered = transactions.filter((transaction) => {
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

    // Sort transactions by date (newest first)
    const sorted = filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Group transactions by formatted date
    return sorted.reduce((acc, transaction) => {
      const date = formatTransactionDate(transaction.createdAt);
      if (!acc[date]) acc[date] = [];
      acc[date].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);
  }, [transactions, selectedCategory, selectedSubcategory]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory("All");
  };

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main>
      <section className="max-w-[414px] h-[1051px] bg-white rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] p-[22.5px] overflow-y-auto scrollbar-hide">
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

        <div className="overflow-y-auto max-h-[1000px] scrollbar-hide">
          <ul>
            {Object.entries(groupedTransactions).map(([date, transactions]) => (
              <li key={date} className="mb-6">
                <p className="text-[#6f6f6f] text-sm font-normal mb-[20px]">{date}</p>
                {transactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center gap-4 w-full mb-[20px]">
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
                ))}
              </li>
            ))}
          </ul>
        </div>


      </section>
    </main>
  );
};

export default TransactionList;
