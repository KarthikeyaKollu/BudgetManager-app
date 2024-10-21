const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  what: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  clerkId: { type: String, required: true, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
