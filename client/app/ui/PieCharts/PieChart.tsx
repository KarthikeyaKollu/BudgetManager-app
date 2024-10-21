"use client"
import React, { useEffect, useState } from 'react'
import MonthlyExpenseCard from './Chart'
import { RootState, AppDispatch } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";

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

  const dispatch = useDispatch<AppDispatch>();
  const { items: transactions, loading, error } = useSelector(
    (state: RootState) => state.transactions
  );
  const [summary, setSummary] = useState<ExpenseSummary>({
    essentials: 0,
    nonEssentials: 0,
    miscellaneous: 0,
    essentialPercent: 0,
    nonEssentialPercent: 0,
    miscellaneousPercent: 0,
  })

  const calculateSummary = async () => {
    const summary = {
      essentials: 0,
      nonEssentials: 0,
      miscellaneous: 0,
    };

    // Sum the total expenses based on the category
    transactions.forEach((transaction) => {
      switch (transaction.category) {
        case "Essential Expenses":
          summary.essentials += transaction.amount;
          break;
        case "Non-Essential Expenses":
          summary.nonEssentials += transaction.amount;
          break;
        case "Miscellaneous":
          summary.miscellaneous += transaction.amount;
          break;
      }
    });

    // Calculate the total amount spent across all categories
    const total = summary.essentials + summary.nonEssentials + summary.miscellaneous;

    // Calculate the percentage contribution of each category
    const essentialPercent = total ? (summary.essentials / total) * 100 : 0;
    const nonEssentialPercent = total ? (summary.nonEssentials / total) * 100 : 0;
    const miscellaneousPercent = total ? (summary.miscellaneous / total) * 100 : 0;


    setSummary({
      essentials: summary.essentials,
      nonEssentials: summary.nonEssentials,
      miscellaneous: summary.miscellaneous,
      essentialPercent: parseFloat(essentialPercent.toFixed(1)),
      nonEssentialPercent: parseFloat(nonEssentialPercent.toFixed(1)),
      miscellaneousPercent: parseFloat(miscellaneousPercent.toFixed(1)),
    })

  }
  useEffect(() => {
    // Check if transactions is an array and has elements
    if (!Array.isArray(transactions) || transactions.length <= 0) return;

    calculateSummary();
  }, [transactions]);


  return (
    <div>
      <MonthlyExpenseCard summary={summary} />
    </div>
  )
}

export default PieChart
