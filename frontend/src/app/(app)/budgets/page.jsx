'use client';
import BudgetCards from '@/components/global/budgetCards';
import { CreateBudgetButton } from '@/components/global/createBudegetButton';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {  updateBudgets } from '@/store/slices/budgetSlice';
import SyncAuthFromLocalStorage from '@/components/global/cookies';
import BudgetCardSkeleton from '@/components/global/skeleton/budgetCardSkeleton';


const FullScreenDummy = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const budgets = useSelector((state) => state.budgets?.budgets);
    console.log('budgets', budgets);
    const loading = useSelector((state) => state.budgets?.loading);
    const [userFromLocalStorage, setUserFromLocalStorage] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUserFromLocalStorage(storedUser);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            const timeoutId = setTimeout(() => {
                router.push('/signin');
            }, 5000);

            return () => clearTimeout(timeoutId);
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (userFromLocalStorage?.email) {
            dispatch(updateBudgets(userFromLocalStorage.email));
        }
    }, [dispatch, userFromLocalStorage]);

    return (
        <div className="w-screen min-h-screen bg-neutral-300/50 p-4 overflow-hidden">
            <h1 className="font-bold text-3xl text-black mb-5 font-sans">My Budgets</h1>
            <div className="flex gap-2 md:flex-row flex-col md:justify-start items-center justify-center flex-wrap">
                <div
                    id="budgetCreation"
                    className="bg-[#d7d1d1] border-2 border-dashed h-56 w-80 rounded-[20px] md:ml-5 flex items-center justify-center"
                >
                    <div>
                        <CreateBudgetButton />
                    </div>
                </div>
                {loading
                    ? Array(6)
                        .fill(0)
                        .map((_, index) => <BudgetCardSkeleton key={index} />)
                    : budgets?.map((budget) => (
                        <BudgetCards
                            key={budget.id || `${budget.budget_name}-${budget.category}`}
                            budget={budget}
                        />
                    ))}
            </div>
            <SyncAuthFromLocalStorage />
        </div>
    );
};

export default FullScreenDummy;
