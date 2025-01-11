'use client'
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    budgets: [], // Updated to store an array of budgets
    total_budgets: 0,
    total_budget_amount: 0,
    loading: false,
    error: null,
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

export const createBudget = createAsyncThunk(
    'budgets/create',
    async (data) => {
        console.log("Data from create slice", data);
        const response = await axios.post(`${BASE_URL}/api/create_budget/`, {
            budget_name: data.budget_name,
            budget_amount: data.budget_amount,
            category: data.category,
            budget_emoji: data.budget_emoji,
            email: data.email
        }, {
            withCredentials: true
        });
        console.log("the response from create slice", response);
        if (!response) {
            throw new Error('Something went wrong');
        }
        return response.data; // Assuming response contains the created budget
    }
);



export const updateBudgets = createAsyncThunk(
    'budgets/update',
    async (data) => {
        console.log("Email from update slice", data);
        console.log("Email from update slice", data);
        const response = await axios.post(`${BASE_URL}/api/update_budget/`, {
            email: data
        })
        console.log("the response from update slice", response.data.updated_categories);
        if (!response) {
            throw new Error('Something went wrong');
        }
        return response.data
    }
)



export const budgetSlice = createSlice({
    name: 'budgets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        // Handling createBudget action states
        builder.addCase(createBudget.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(createBudget.fulfilled, (state, action) => {
            state.loading = false;
            state.budgets.push(action.payload); // Add the new budget to the budgets array
        })
        builder.addCase(createBudget.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

        // Handling fetchBudgets action states
        builder.addCase(updateBudgets.pending, (state) => {
            state.loading = true;
            state.error = null;
            console.log("fetchBudgets pending...");
        })
        builder.addCase(updateBudgets.fulfilled, (state, action) => {
            state.loading = false;
            state.budgets = action.payload.updated_budgets;
            state.total_budgets = action.payload.updated_budgets.length;
            state.total_budget_amount = action.payload.total_budget_amount
            console.log("fetchBudgets fulfilled - Budgets:", action.payload);
        })
        builder.addCase(updateBudgets.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            console.error("fetchBudgets rejected:", action.error.message);
        });
    }
});

export default budgetSlice.reducer;
