const { connectDB } = require('../database/db');
const Expense = require('../models/expenseModel');
const { verifyUser } = require('./auth'); // Import the verifyUser helper

// CREATE Expense
module.exports.createExpense = async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    const user = await verifyUser(event); // Verify user

    const { what, amount, category, subcategory } = JSON.parse(event.body);
    const newExpense = new Expense({ what, amount, category, subcategory, clerkId: user.clerkId });
    await newExpense.save();

    return { statusCode: 201, body: JSON.stringify(newExpense) };
  } catch (error) {
    console.error('Error creating expense:', error);
    return {
      statusCode: error.message.includes('Authorization') ? 401 : 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// READ Expenses with Filtering and Sorting
module.exports.getExpenses = async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    const user = await verifyUser(event); // Verify user

    const { category = 'All', subcategory = 'All' } = event.queryStringParameters || {};
    const filter = { clerkId: user.clerkId };

    if (category !== 'All') filter.category = category;
    if (subcategory !== 'All') filter.subcategory = subcategory;

    const expenses = await Expense.find(filter).sort({ createdAt: -1 }).exec();

    return { statusCode: 200, body: JSON.stringify(expenses) };
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return {
      statusCode: error.message.includes('Authorization') ? 401 : 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// UPDATE Expense
module.exports.updateExpense = async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    const user = await verifyUser(event); // Verify user

    const { id } = event.pathParameters;
    const { what, amount, category, subcategory } = JSON.parse(event.body);

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, clerkId: user.clerkId }, // Ensure user can only update their own expenses
      { what, amount, category, subcategory },
      { new: true }
    );

    if (!updatedExpense) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Expense not found' }) };
    }

    return { statusCode: 200, body: JSON.stringify(updatedExpense) };
  } catch (error) {
    console.error('Error updating expense:', error);
    return {
      statusCode: error.message.includes('Authorization') ? 401 : 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// DELETE Expense
module.exports.deleteExpense = async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    const user = await verifyUser(event); // Verify user

    const { id } = event.pathParameters;
    const deletedExpense = await Expense.findOneAndDelete({ _id: id, clerkId: user.clerkId });

    if (!deletedExpense) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Expense not found' }) };
    }

    return { statusCode: 200, body: JSON.stringify(deletedExpense) };
  } catch (error) {
    console.error('Error deleting expense:', error);
    return {
      statusCode: error.message.includes('Authorization') ? 401 : 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
