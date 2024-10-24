"use client"
import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";
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
const Modal = ({ onClose }) => {

  const { user } = useUser(); // Use useUser hook to get the user object
  const [formData, setFormData] = useState({
    what: '',
    amount: '',
    category: categories[0].category,
    subcategory: categories[0].subcategories[0].name,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const firstSubcategory = categories.find(cat => cat.category === selectedCategory).subcategories[0].name;

    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      subcategory: firstSubcategory,
    }));
  };

  const handleSubmit = async () => {
    try {
      await postExpense({ ...formData, clerkId: user?.id }); // Await the postExpense call
      alert("Successfully added"); // Correct the spelling
      window.location.reload();
    } catch (error) {
      console.error("Error adding expense:", error); // Log the error for debugging
      alert("Failed to add expense"); // Update the alert message for clarity
    }

    onClose(); // Close the form/modal regardless of success or failure
  };


  const host = process.env.NEXT_PUBLIC_HOST_API

  const postExpense = async (expenseData) => {
    try {
      const response = await fetch(`${host}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.message}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to add expense:', error.message);
    }
  };


  return (
    <div className="w-[414px] h-[562px] bg-white rounded-[16px] shadow px-[45px] space-y-[16px] relative flex flex-col  justify-center">
      <button
        className="absolute top-2 right-2"
        onClick={onClose}
      >
        ✖️
      </button>
      <div className="text-black text-[24px] font-semibold mb-5">New Expense</div>

      <div className="mb-4">
        <label className="text-[#606060] text-xs font-medium">What did you spend on?</label>
        <input
          type="text"
          name="what"
          value={formData.what}
          onChange={handleChange}
          className="w-full h-[42px] mt-1 bg-white rounded-md border-2 border-[#5997ed] px-3 text-base"
        />
      </div>

      <div className="mb-4">
        <label className="text-[#606060] text-xs font-medium">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full h-[42px] mt-1 bg-white rounded-md border-2 border-[#e3ebfd] px-3 text-base"
        />
      </div>

      <div className="mb-4">
        <label className="text-[#606060] text-xs font-medium">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleCategoryChange}
          className="w-full h-[42px] mt-1 bg-white rounded-md border-2 border-[#e3ebfd] px-3 text-base"
        >
          {categories.map((cat) => (
            <option key={cat.category} value={cat.category}>
              {cat.category}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="text-[#606060] text-xs font-medium">Sub-category</label>
        <select
          name="subcategory"
          value={formData.subcategory}
          onChange={handleChange}
          className="w-full h-[42px] mt-1 bg-white rounded-md border-2 border-[#e3ebfd] px-3 text-base"
        >
          {categories
            .find((cat) => cat.category === formData.category)
            .subcategories.map((sub) => (
              <option key={sub.name} value={sub.name}>
                {sub.icon} {sub.name}
              </option>
            ))}
        </select>
      </div>

      <button
        className="w-full h-[42px] bg-[#005fe4] rounded-md text-white text-lg font-bold"
        onClick={handleSubmit}
      >
        Add
      </button>
    </div>
  );
};

export default Modal;
