import React from 'react'

function BudgetCard({ budget }) {
    return (
        <div id='budgetCard' className='bg-[#d7d1d1] border-1 border-black h-56 w-80 rounded-[20px] md:ml-5 flex flex-col items-center justify-around'>
            <div className='flex gap-2 justify-around items-center mt-2 overflow-hidden p-2 '>
                <div id="emoji" className='bg-neutral-200 h-14 w-18 p-2 rounded-[50%] flex items-center justify-center'>
                    <span className='text-3xl'>{budget?.budget_emoji}</span>
                </div>
                <div className='flex flex-col'>
                    <div id="budgetTitle" className='font-bold text-xl w-[85%] text-black font-sans'>{budget?.budget_name}</div>
                    <span className='text-neutral-700 text-xs'>category: {budget?.category}</span>
                    <span className='text-neutral-700 text-xs'>Started on: {budget?.start_date}</span>
                </div>
                <div id="budgetAmount" className='font-extrabold text-blue-800 font-sans text-2xl'>₹{budget?.budget_amount}</div>
            </div>
            <div id="progressBar" className="w-[90%] flex flex-col">
                <div className='text-neutral-500 flex items-center justify-between'>
                    <span>₹{budget?.amount_spent} spent</span>
                    <span>₹{budget?.budget_amount - budget?.amount_spent} {budget.amount_spent > budget.budget_amount ? "exceeded" : "remaining"}</span>
                </div>
                <progress
                    className="w-full"
                    value={budget?.amount_spent}
                    max={budget?.budget_amount}
                ></progress>
            </div>
        </div>
    )
}

export default BudgetCard
