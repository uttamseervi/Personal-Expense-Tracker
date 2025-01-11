"use client";
import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { createBudget } from '@/store/slices/budgetSlice';

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

const CreateBudget = () => {
    const user = useSelector((state) => state.user);
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'))
    // console.log("user form budget page localstorage",userFromLocalStorage)
    const [formState, setFormState] = useState({
        budget_emoji: '😁',
        budget_name: '',
        budget_amount: '',
        category: '',
        email: user?.user?.email || userFromLocalStorage.email 
    });
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

    const dispatch = useDispatch();

    const handleEmojiClick = (emoji) => {
        // Set the selected emoji properly
        setFormState((prev) => ({ ...prev, budget_emoji: emoji }));
        setOpenEmojiPicker(false);  // Close the emoji picker after selection
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formState.budget_name || !formState.budget_amount || !formState.category) {
            alert("Please fill out all fields before submitting.");
            return;
        }
        console.log("Form State", formState);
        dispatch(createBudget(formState));
        alert("Budget created successfully!");
        setFormState({
            budget_emoji: '😁',
            budget_name: '',
            budget_amount: '',
            category: '',
        });
    };

    // Ensure user exists before showing the form
    if (!user?.user) {
        return <p>Please log in to create a budget.</p>;
    }

    return (
        <div>
            <h4 className="text-lg md:text-2xl text-neutral-600 font-bold text-center mb-8">
                Create a new Budget
            </h4>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center space-y-4">
                <div className="mt-5">
                    <button
                        type="button"
                        className="bg-red-400 p-2 text-2xl rounded-[20%]"
                        onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                    >
                        {formState.budget_emoji} {/* Corrected to use budget_emoji */}
                    </button>
                    {openEmojiPicker && (
                        <div className="absolute z-20 h-full top-4 left-9">
                            <EmojiPicker
                                onEmojiClick={(e) => handleEmojiClick(e.emoji)}
                                allowExpandReactions={true}
                            />
                        </div>
                    )}
                    <div className="mt-2">
                        <h2 className="text-black font-medium my-1">Budget Name</h2>
                        <input
                            name="budget_name" // Corrected name
                            placeholder="e.g. Home Decor"
                            className="lg:w-[800px] rounded-[30px]"
                            value={formState.budget_name} // Corrected value
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-2">
                        <h2 className="text-black font-medium my-1">Budget Amount</h2>
                        <input
                            name="budget_amount" // Corrected name
                            type="number"
                            placeholder="e.g. 5000$"
                            className="lg:w-[800px] rounded-[30px]"
                            value={formState.budget_amount} // Corrected value
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-2">
                        <h2 className="text-black font-medium my-1">Budget Category</h2>
                        <select
                            name="category"
                            className="lg:w-[800px] rounded-[30px] bg-white text-black"
                            value={formState.category}
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
                        Create Budget
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBudget;
