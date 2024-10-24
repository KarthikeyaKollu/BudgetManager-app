"use client";
import React, { useEffect, useState } from "react";
import MonthlyExpenseCard from "./Chart";
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

interface ExpenseSummary {
  essentials: number;
  nonEssentials: number;
  miscellaneous: number;
  essentialPercent: number;
  nonEssentialPercent: number;
  miscellaneousPercent: number;
}

const PieChart = () => {
  const { user } = useUser();
  const userId = user?.id;
  const { session } = useSession();


  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary>({
    essentials: 0,
    nonEssentials: 0,
    miscellaneous: 0,
    essentialPercent: 0,
    nonEssentialPercent: 0,
    miscellaneousPercent: 0,
  });

  const host = process.env.NEXT_PUBLIC_HOST_API;

  const fetchLastMonthTransactions = async () => {
    const today = new Date();
    const startDate = new Date(today.setDate(today.getDate() - 30)).toISOString();
    const endDate = new Date().toISOString();

    const token = await session?.getToken();

    try {
      const response = await fetch(
        `${host}/expenses/${userId}?category=All&subcategory=All&startDate=${startDate}&endDate=${endDate}`,
        {
          method: 'GET', // Specify the method
          headers: {
            'Authorization': `Bearer ${token}`, // Include the JWT in the Authorization header
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data); // Set the transactions state with the fetched data
    } catch (error) {
      console.error(error);
      setTransactions([]); // Reset transactions on error
    }
  };



  // Call the function to fetch the token
  const calculateSummary = () => {
    const summary = transactions.reduce(
      (acc, transaction) => {
        switch (transaction.category) {
          case "Essential Expenses":
            acc.essentials += transaction.amount;
            break;
          case "Non-Essential Expenses":
            acc.nonEssentials += transaction.amount;
            break;
          case "Miscellaneous":
            acc.miscellaneous += transaction.amount;
            break;
        }
        return acc;
      },
      { essentials: 0, nonEssentials: 0, miscellaneous: 0 }
    );

    const total = summary.essentials + summary.nonEssentials + summary.miscellaneous;

    setSummary({
      essentials: summary.essentials,
      nonEssentials: summary.nonEssentials,
      miscellaneous: summary.miscellaneous,
      essentialPercent: total ? parseFloat(((summary.essentials / total) * 100).toFixed(1)) : 0,
      nonEssentialPercent: total ? parseFloat(((summary.nonEssentials / total) * 100).toFixed(1)) : 0,
      miscellaneousPercent: total ? parseFloat(((summary.miscellaneous / total) * 100).toFixed(1)) : 0,
    });
  };

  useEffect(() => {
    if (userId) {
      fetchLastMonthTransactions();
    }
  }, [userId]);

  useEffect(() => {
    if (transactions.length > 0) {
      calculateSummary();
    }
  }, [transactions]);

  return (
    <div>
      <MonthlyExpenseCard summary={summary} />
    </div>
  );
};

export default PieChart;
