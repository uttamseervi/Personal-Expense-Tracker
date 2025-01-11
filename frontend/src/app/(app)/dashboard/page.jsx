'use client';
import Image from "next/image";
import { IconPigMoney, IconPaperclip, IconWallet, IconCurrencyDollarGuyanese } from "@tabler/icons-react";
import { BarChart, Card, DonutChart } from '@tremor/react';
import BudgetCard from "@/components/global/budgetCards";
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import SigninButton from "@/components/global/authButton";
import SuggestionBox from "@/components/global/suggestionBox";
import SyncAuthFromLocalStorage from "@/components/global/cookies";
import { useEffect } from "react";
import { updateBudgets } from "@/store/slices/budgetSlice";
import { fetchCategorizedTransaction } from "@/store/slices/transactionSlice";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user?.user?.email) {
      dispatch(updateBudgets(user?.user?.email));
      dispatch(fetchCategorizedTransaction({
        transaction_category: 'all',
        email: user?.user?.email
      }));
    }
  }, [user?.user?.email, dispatch]);

  const spent_categories = useSelector((state) => state?.transactions?.transactions);

  // Aggregate spending by category
  const spendData = spent_categories.reduce((acc, category) => {
    if (category?.transaction_category !== 'savings') {  // Exclude savings from spending
      const existingCategory = acc.find(item => item.category === category?.transaction_category);
      if (existingCategory) {
        existingCategory.amount += category?.transaction_amount;
      } else {
        acc.push({
          category: category?.transaction_category,
          amount: category?.transaction_amount
        });
      }
    }
    return acc;
  }, []);

  // Similarly aggregate savings data
  const savingData = spent_categories
    .filter(category => category?.transaction_category === "savings")
    .reduce((acc, category) => {
      const existingCategory = acc.find(item => item.category === category?.transaction_name);
      if (existingCategory) {
        existingCategory.amount += category?.transaction_amount;
      } else {
        acc.push({
          category: category?.transaction_name,
          amount: category?.transaction_amount
        });
      }
      return acc;
    }, []);

  const total_spent_amount = useSelector((state) => state.transactions?.total_spent_amount);
  const total_savings_amount = useSelector((state) => state.transactions?.total_savings_amount);
  const total_budgets = useSelector((state) => state.budgets?.total_budgets);
  const total_budget_amount = useSelector((state) => state.budgets?.total_budget_amount);
  const Budgets = useSelector((state) => state.budgets?.budgets);
  let latestBudgets = Budgets.slice(Budgets?.length - 2, Budgets?.length);

  return (
    <main className="md:p-4 p-2 text-black bg-neutral-300/50 min-h-screen overflow-hidden mb-20 w-screen">
      <div className="md:ml-2 p-3 ml-6">
        <h1 className="font-bold md:text-5xl text-xl">Hi, {user?.user?.username}</h1>
        <p className="font-medium text-neutral-500 text-[14px]">Here's what happening with your money, Lets Manage your Expense</p>
      </div>

      <SuggestionBox total_savings_amount={total_savings_amount} total_spent_amount={total_spent_amount}/>

      <div id="budgetGrids" className="flex md:flex-wrap md:flex-row flex-col items-center justify-around gap-5 mt-8 w-[90%] mx-auto transition-transform duration-500 ease-in-out">
        <div className="md:w-60 w-full h-32 bg-[#FAF7F0] flex items-center justify-center gap-8 rounded-3xl">
          <div>
            <h3 className="font-semibold">Total Budget</h3>
            <h1 className="font-extrabold text-2xl">₹ {total_budget_amount}</h1>
          </div>
          <div className="bg-blue-800 p-2 rounded-[50%] w-12 h-12 flex items-center justify-center">
            <IconPigMoney color="white" />
          </div>
        </div>

        <div className="md:w-60 w-full h-32 bg-[#FAF7F0] flex items-center justify-center gap-8 rounded-3xl">
          <div>
            <h3 className="font-semibold">Total Spend</h3>
            <h1 className="font-extrabold text-2xl">₹ {total_spent_amount}</h1>
          </div>
          <div className="bg-blue-800 p-2 rounded-[50%] w-12 h-12 flex items-center justify-center">
            <IconPaperclip color="white" />
          </div>
        </div>

        <div className="md:w-60 w-full h-32 bg-[#FAF7F0] flex items-center justify-center gap-8 rounded-3xl">
          <div>
            <h3 className="font-semibold">No. Of Budgets</h3>
            <h1 className="font-extrabold text-2xl">{total_budgets}</h1>
          </div>
          <div className="bg-blue-800 p-2 rounded-[50%] w-12 h-12 flex items-center justify-center">
            <IconWallet color="white" />
          </div>
        </div>

        <div className="md:w-60 w-full h-32 bg-[#FAF7F0] p-3 flex items-center justify-center gap-8 rounded-3xl">
          <div>
            <h3 className="font-semibold text-[15px]">Remaining Amount from Salary</h3>
            <h1 className="font-extrabold text-2xl">₹ {total_savings_amount}</h1>
          </div>
          <div className="bg-blue-800 p-2 rounded-[50%] w-12 h-12 flex items-center justify-center">
            <IconCurrencyDollarGuyanese color="white" />
          </div>
        </div>
      </div>

      <section className="mt-10 md:ml-20 grid grid-cols-1 lg:grid-cols-2 lg:gap-4 gap-14">
        <div id="graph" className="md:w-[490px] md:h-[360px] bg-transparent rounded-[18px]">
          <h1 className="m-2 font-bold text-2xl bg-neutral-700 text-white p-3 rounded-lg mb-4 inline hover:cursor-pointer">
            Your Spends
          </h1>
          <Card className="bg-transparent mt-5 text-white">
            <DonutChart
              data={spendData}
              index="category"
              category="amount"
              variant="pie"
              className="h-[250px]"
            />
          </Card>
        </div>
        
        <div id="graph" className="md:w-[490px] md:h-[360px] bg-transparent rounded-[18px]">
          <h1 className="m-2 font-bold text-2xl bg-neutral-700 text-white p-3 rounded-lg mb-4 mt-2 inline hover:cursor-pointer">
            Your Savings
          </h1>
          <Card className="bg-transparent mt-5 text-white">
            <DonutChart
              data={savingData}
              index="category"
              category="amount"
              variant="pie"
              className="h-[250px]"
            />
          </Card>
        </div>
      </section>
      <SyncAuthFromLocalStorage />
    </main>
  );
}