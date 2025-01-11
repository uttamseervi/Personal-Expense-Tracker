'use client'
import AddTransactionButton from '@/components/global/addTransactionButton';
import SigninButton from '@/components/global/authButton';
import SyncAuthFromLocalStorage from '@/components/global/cookies';
import TransactionTable from '@/components/global/transactionTable';
import { useRouter } from 'next/navigation';
import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';

const transactions = [
    { id: 1, name: 'Groceries', amount: 50, date: '2024-12-19', action: 'category' },
    { id: 2, name: 'Electricity Bill', amount: 120, date: '2024-12-18', action: 'category' },
    { id: 3, name: 'Internet Bill', amount: 30, date: '2024-12-17', action: 'category' },
    { id: 4, name: 'Dining Out', amount: 40, date: '2024-12-16', action: 'category' },
    { id: 7, name: 'Dining Out', amount: 40, date: '2024-12-16', action: 'category' },
];

const Income = () => {

    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const router = useRouter();

    console.log("isAuthenticated:", isAuthenticated)
    useEffect(() => {
        if (!isAuthenticated) {
            const timeoutId = setTimeout(() => {
                router.push('/signin');
            }, 5000);

            return () => clearTimeout(timeoutId);
        }
    }, [isAuthenticated, router]);


    return (
        <div className="min-h-screen overflow-hidden bg-neutral-300/50">
            <div className='flex justify-evenly items-center '>
                <div className="ml-5 mb-5 mt-2 ">
                    <h1 className="font-extrabold text-3xl font-sans text-black mb-2">My Expenses</h1>
                    <h1 className="text-xl font-extrabold text-black">Latest Expenses</h1>
                </div>
                <div>
                    <AddTransactionButton />
                </div>
            </div>
            <div>
                <TransactionTable />
            </div>
            <SyncAuthFromLocalStorage />
        </div>
    );
};

export default Income;
