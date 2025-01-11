"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction } from "@/store/slices/transactionSlice";

const categories = [
    { value: "housing", label: "Housing" },
    { value: "transportation", label: "Transportation" },
    { value: "food", label: "Food" },
    { value: "healthcare", label: "Healthcare" },
    { value: "utilities", label: "Utilities" },
    { value: "insurance", label: "Insurance" },
    { value: "debt", label: "Debt Payments" },
    { value: "savings", label: "Savings & Investments" },
    { value: "entertainment", label: "Entertainment" },
    { value: "personal_care", label: "Personal Care" },
    { value: "clothing", label: "Clothing" },
    { value: "education", label: "Education" },
    { value: "gifts_donations", label: "Gifts & Donations" },
    { value: "children", label: "Children" },
    { value: "pets", label: "Pets" },
    { value: "travel", label: "Travel" },
    { value: "miscellaneous", label: "Miscellaneous" },
    { value: "business_operations", label: "Business Operations" },
    { value: "professional_development", label: "Professional Development" },
    { value: "freelance", label: "Freelance Work" },
    { value: "taxes", label: "Taxes" },
    { value: "legal_accounting", label: "Legal & Accounting" },
];

const AddTransaction = () => {
    const user = useSelector((state) => state.user);
    const [formState, setFormState] = useState({
        transaction_name: "",
        transaction_amount: "",
        transaction_date: "",
        transaction_category: "",
        email: user?.user?.email || "",
    });

    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const { transaction_name, transaction_amount, transaction_date, transaction_category } = formState;

        if (!transaction_name || !transaction_amount || !transaction_date || !transaction_category) {
            alert("Please fill out all fields before submitting.");
            return;
        }

        console.log("Form State:", formState);
        dispatch(addTransaction(formState));
        alert("Transaction added successfully!");

        setFormState({
            transaction_name: "",
            transaction_amount: "",
            transaction_date: "",
            transaction_category: "",
            email: user?.user?.email || "",
        });
    };

    if (!user?.user) {
        return <p>Please log in to add a transaction.</p>;
    }

    return (
        <div>
            <h4 className="text-lg md:text-2xl text-neutral-600 font-bold text-center mb-8">
                Add a new transaction
            </h4>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center space-y-4">
                <div className="mt-5">
                    <div className="mt-2">
                        <h2 className="text-black font-medium my-1">Transaction Name</h2>
                        <input
                            name="transaction_name"
                            placeholder="e.g. Monthly Rent"
                            className="lg:w-[800px] rounded-[30px] p-2 border border-gray-300"
                            value={formState.transaction_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-2">
                        <h2 className="text-black font-medium my-1">Amount</h2>
                        <input
                            name="transaction_amount"
                            type="number"
                            placeholder="e.g. 5000"
                            className="lg:w-[800px] rounded-[30px] p-2 border border-gray-300"
                            value={formState.transaction_amount}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-2">
                        <h2 className="text-black font-medium my-1">Date</h2>
                        <input
                            name="transaction_date"
                            type="date"
                            className="lg:w-[800px] rounded-[30px] p-2 border border-gray-300"
                            value={formState.transaction_date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-2">
                        <h2 className="text-black font-medium my-1">Category</h2>
                        <select
                            name="transaction_category"
                            className="lg:w-[800px] rounded-[30px] bg-white text-black p-2 border border-gray-300"
                            value={formState.transaction_category}
                            onChange={handleChange}
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-[#231f1f] w-full mt-5 p-3 rounded-[30px] text-white"
                    >
                        Add your transaction
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTransaction;
