import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id?: string;
  name: string;
  email: string;
}

interface UsersState {
  items: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  loading: false,
  error: null,
};

const host = process.env.NEXT_PUBLIC_HOST_API  // Fallback for localhost

// Middleware to post a new user
export const postUser = createAsyncThunk(
  'users/postUser',
  async (user: User, { rejectWithValue }) => {
    try {
      const response = await fetch(`${host}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error('Failed to create user');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Middleware to update a user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: { id: string; data: User }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${host}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(postUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.items.findIndex((user) => user._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export default userSlice.reducer;
