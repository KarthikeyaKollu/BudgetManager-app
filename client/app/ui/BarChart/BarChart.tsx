import React, { useEffect, useState } from 'react';
import BarChartComponent from '@/components/BarChartComponent';
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

const BarChart = () => {
  const { user } = useUser();
  const { session } = useSession();
  const userId = user?.id;
  const host = process.env.NEXT_PUBLIC_HOST_API;

  const [chartData, setChartData] = useState<any[]>([]); // State to hold chart data

  const fetchLast7DaysTransactions = async (userId: string) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7); // 7 days ago
    const endDate = new Date(); // today

    const token = await session?.getToken();
    try {
      const response = await fetch(
        `${host}/expenses/${userId}?category=All&subcategory=All&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,{
          method: 'GET', // Specify the method
          headers: {
            'Authorization': `Bearer ${token}`, // Include the JWT in the Authorization header
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data: Transaction[] = await response.json();
      return data; // Return the fetched transactions
    } catch (error) {
      console.error(error);
      return []; // Return an empty array on error
    }
  };

  const generateChartData = (transactions: Transaction[]) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Initialize amounts for categories
    const dateMap: Record<string, { essential: number, nonEssential: number, miscellaneous: number, total: number }> = {};

    // Populate the dateMap with transaction data
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      const dateKey = transactionDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });


      // Determine category amounts
      if (transaction.category === "Essential Expenses") {
        if (!dateMap[dateKey]) {
          dateMap[dateKey] = { essential: 0, nonEssential: 0, miscellaneous: 0, total: 0 };
        }
        dateMap[dateKey].essential += transaction.amount;
      } else if (transaction.category === "Non-Essential Expenses") {
        if (!dateMap[dateKey]) {
          dateMap[dateKey] = { essential: 0, nonEssential: 0, miscellaneous: 0, total: 0 };
        }
        dateMap[dateKey].nonEssential += transaction.amount;
      } else {
        if (!dateMap[dateKey]) {
          dateMap[dateKey] = { essential: 0, nonEssential: 0, miscellaneous: 0, total: 0 };
        }
        dateMap[dateKey].miscellaneous += transaction.amount;
      }

      // Update total
      dateMap[dateKey].total += transaction.amount;
    });

    // Prepare the final data
    const formattedData = [];
    for (let i = 6; i >= 0; i--) {
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - i);

      const formattedDate = pastDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
      });

      // Add the data for the date, or zero if no data
      const dailyData = dateMap[formattedDate] || { essential: 0, nonEssential: 0, miscellaneous: 0, total: 0 };
      const displayDate = formattedDate === today.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) ? "Today" :
        formattedDate === yesterday.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) ? "Yesterday" :
          formattedDate;

      formattedData.push({
        date: displayDate,
        essential: dailyData.essential,
        nonEssential: dailyData.nonEssential,
        miscellaneous: dailyData.miscellaneous,
        total: dailyData.total,
      });
    }

    return formattedData; // Reverse to have the most recent date on the right
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const transactions = await fetchLast7DaysTransactions(userId);        
        const data = generateChartData(transactions);
        setChartData(data);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div>
      <BarChartComponent data={chartData} /> {/* Pass chart data as props */}
    </div>
  );
};

export default BarChart;
