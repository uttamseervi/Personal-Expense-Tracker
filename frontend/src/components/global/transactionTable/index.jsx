'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategorizedTransaction } from '@/store/slices/transactionSlice';
import TransactionTableSkeleton from '../skeleton/transactionTableSkeleton';

const TransactionTable = () => {
    const user = useSelector((state) => state?.user);
    const dispatch = useDispatch();
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    console.log("user from localstorage:", userFromLocalStorage);
    console.log("user:", user?.user?.email);

    const [formState, setFormState] = useState({
        transaction_category: 'all',  // Default category
        email: user?.user?.email || userFromLocalStorage?.email,  // User email
        transaction_date: 'all',  // Default date range
    });

    const handleCategoryChange = (e) => {
        setFormState({
            ...formState,
            transaction_category: e.target.value,
        });
    };

    const handleDateChange = (e) => {
        setFormState({
            ...formState,
            transaction_date: e.target.value,
        });
    };

    // Fetch transactions when any of the filters change
    useEffect(() => {
        if (user?.user?.email || userFromLocalStorage?.email) {
            dispatch(fetchCategorizedTransaction(formState)); // Dispatch the action to fetch transactions
        }
    }, [formState.transaction_category, formState.transaction_date, dispatch, user?.user?.email, userFromLocalStorage?.email]);

    // Get the transactions and loading state from Redux store
    const transactions = useSelector((state) => state?.transactions?.transactions);
    const loading = useSelector((state) => state?.transactions?.loading);

    return (
        <main className='w-screen '>
            {loading ? (
                <TransactionTableSkeleton />
            ) : (
                <div className="w-[75%] mx-auto rounded-[10px] overflow-hidden border border-gray-300">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-300">
                                <th className="px-4 py-2 text-left text-sm font-bold text-gray-600">Name</th>
                                <th className="px-4 py-2 text-left text-sm font-bold text-gray-600">Amount</th>
                                <th className="px-4 py-2 text-left text-sm font-bold text-gray-600">Date</th>
                                <th className="px-4 py-2 text-left text-sm font-bold text-gray-600">Category</th>
                                <th className="px-4 py-2 text-left text-sm font-bold text-gray-600">
                                    <select
                                        name="transaction_category"
                                        className="lg:w-[200px] rounded-[30px] bg-white text-black"
                                        value={formState.transaction_category}
                                        onChange={handleCategoryChange}
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-bold text-gray-600">
                                    <select
                                        name="transaction_date"
                                        className="lg:w-[200px] rounded-[30px] bg-white text-black"
                                        value={formState.transaction_date}
                                        onChange={handleDateChange}
                                    >
                                        <option value="all">All Time</option>
                                        <option value="today">Today</option>
                                        <option value="this_week">This Week</option>
                                        <option value="this_month">This Month</option>
                                        <option value="last_month">Last Month</option>
                                    </select>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index} className="bg-transparent">
                                    <td className="px-4 py-2 text-sm text-gray-800">{transaction?.transaction_name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">${transaction?.transaction_amount}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{transaction?.transaction_date}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{transaction?.transaction_category}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
};

export default TransactionTable;

// Categories for the dropdown menu
const categories = [
    { value: 'housing', label: 'Housing' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'food', label: 'Food' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'debt', label: 'Debt Payments' },
    { value: 'savings', label: 'Savings & Investments' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'personal_care', label: 'Personal Care' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'education', label: 'Education' },
    { value: 'gifts_donations', label: 'Gifts & Donations' },
    { value: 'children', label: 'Children' },
    { value: 'pets', label: 'Pets' },
    { value: 'travel', label: 'Travel' },
    { value: 'miscellaneous', label: 'Miscellaneous' },
    { value: 'business_operations', label: 'Business Operations' },
    { value: 'professional_development', label: 'Professional Development' },
    { value: 'freelance', label: 'Freelance Work' },
    { value: 'taxes', label: 'Taxes' },
    { value: 'legal_accounting', label: 'Legal & Accounting' },
];
