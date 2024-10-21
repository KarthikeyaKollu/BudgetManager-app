const { connectDB } = require('../database/db');
const Expense = require('../models/expenseModel');

// CREATE Expense
module.exports.createExpense = async (event) => {
  const { what, amount, category, subcategory, clerkId } = JSON.parse(event.body);
  console.log(JSON.parse(event.body))
  
  await connectDB(); // Ensure DB connection

  const newExpense = new Expense({ what, amount, category, subcategory, clerkId });
  await newExpense.save();

  return { statusCode: 201, body: JSON.stringify(newExpense) };
};

// READ Expenses for a specific user
module.exports.getExpenses = async (event) => {
  const { id } = event.pathParameters; // Assuming clerkId is passed as a path parameter
  await connectDB(); // Ensure DB connection
  console.log(event.pathParameters)

  const expenses = await Expense.find({ clerkId:id });
  return { statusCode: 200, body: JSON.stringify(expenses) };
};


// UPDATE Expense
module.exports.updateExpense = async (event) => {
  const { id } = event.pathParameters;
  const { what, amount, category, subcategory } = JSON.parse(event.body);

  await connectDB(); // Ensure DB connection

  const updatedExpense = await Expense.findByIdAndUpdate(id, { what, amount, category, subcategory }, { new: true });
  return { statusCode: 200, body: JSON.stringify(updatedExpense) };
};

// DELETE Expense
module.exports.deleteExpense = async (event) => {
  const { id } = event.pathParameters;

  await connectDB(); // Ensure DB connection

  const deletedExpense = await Expense.findByIdAndDelete(id);
  return { statusCode: 200, body: JSON.stringify(deletedExpense) };
};
