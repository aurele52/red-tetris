import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

type CounterState = { value: number; status: "idle" | "loading" | "failed" };
const initialState: CounterState = { value: 0, status: "idle" };

export const fetchIncrement = createAsyncThunk<number, void>(
  "counter/fetchIncrement",
  async () => {
    // simulons un appel API
    await new Promise((r) => setTimeout(r, 400));
    return 1;
  },
);

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    addBy: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncrement.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchIncrement.fulfilled, (state, action) => {
        state.status = "idle";
        state.value += action.payload;
      })
      .addCase(fetchIncrement.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { increment, decrement, addBy } = counterSlice.actions;
export default counterSlice.reducer;
