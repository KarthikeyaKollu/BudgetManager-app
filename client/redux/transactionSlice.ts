// transactionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


// Define the structure of a transaction
interface Transaction {
  _id: string;
  what: string;
  amount: number;
  category: string;
  subcategory: string;
  createdAt: string;
}

// Define the initial state
interface TransactionsState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk to fetch transactions from backend
const host = process.env.NEXT_PUBLIC_HOST_API  // Fallback for localhost

// Async thunk to fetch transactions from backend
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (
    { userId, category = 'All', subcategory = 'All', token }:
      { userId: string; category?: string; subcategory?: string, token: string },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams({
        category,
        subcategory,
      });

      const url = `${host}/expenses/${userId}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET', // Specify the method
        headers: {
          'Authorization': `Bearer ${token}`, // Include the JWT in the Authorization header
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch transactions');

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);




// Create the slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default transactionSlice.reducer;
