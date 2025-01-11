import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from './slices/userSlice'
import  budgetSlice  from "./slices/budgetSlice";
import transactionSlice from "./slices/transactionSlice";
const store = configureStore({
    reducer: {
        user:userSliceReducer,
        budgets:budgetSlice,
        transactions:transactionSlice,
    }
})

export default store