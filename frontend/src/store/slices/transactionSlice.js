import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";

const initialState = {
    transactions: [],
    savings:[],
    loading: false,
    error: null,
    total_savings_amount: 0,
    total_spent_amount: 0,
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
console.log('BACKEND_URL', BACKEND_URL)

export const addTransaction = createAsyncThunk(
    'transactions/addTransaction',
    async (data) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/create_transaction/`, {
                transaction_name: data.transaction_name,
                transaction_amount: data.transaction_amount,
                transaction_category: data.transaction_category,
                transaction_date: data.transaction_date,
                email: data.email,
            });
            console.log("Response from backend:", response.data);
        } catch (error) {
            console.error("Axios error:", error.message);
            if (error.response) {
                console.error("Backend response:", error.response.data);
            }
        }

    }
)

export const fetchCategorizedTransaction = createAsyncThunk(
    'transactions/fetch_categorized_transaction',
    async (data) => {
        console.log('data from the fetch', data)
        try {
            
            const response = await axios.post(`${BACKEND_URL}/api/fetch_transaction_by_category/`, {
                transaction_category: data.transaction_category,
                email: data.email
            })
            // console.log('response from the fetch', response.data.total_spent_amount)
            if (!response) {
                throw new Error('Something went wrong while fetching transactions didnt get the response')
            }
            return response.data
        } catch (error) {
            throw new Error("Something went wrong while fetching transactions")
        }
    }
)

export const getAllSavingsTransactions = createAsyncThunk(
    'transactions/getAllSavingsTransactions',
    async(email)=>{
        try {
            console.log("the email from get all savings", email)
            const response = await axios.post(`${BASE_URL}/api/get_savings/`, {
                email: email
            })
            console.log("the response from get all savings", response.data.savings);
            return response.data.savings;
        } catch (error) {
            throw new Error('Something went wrong While fetching the Savings');
        }
    }
)

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addTransaction.pending, (state, action) => {
                state.loading = true

            })
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.loading = false
                state.transactions.push(action.payload)
            })
            .addCase(addTransaction.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(fetchCategorizedTransaction.pending, (state, action) => {
                state.loading = true
            })
            .addCase(fetchCategorizedTransaction.fulfilled, (state, action) => {
                state.loading = false
                state.transactions = action.payload.transactions
                state.total_savings_amount = action.payload.total_savings_amount
                state.total_spent_amount = action.payload.total_spent_amount
            })
            .addCase(fetchCategorizedTransaction.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(getAllSavingsTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllSavingsTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.savings = action.payload;
            })
            .addCase(getAllSavingsTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    
    }
})


export default transactionSlice.reducer