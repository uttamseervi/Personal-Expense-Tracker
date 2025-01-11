import React from "react";
import { motion } from "framer-motion";

function BudgetCardSkeleton() {
    return (
        <motion.div
            id="budgetCardSkeleton"
            className="bg-[#d7d1d1] border-2 h-56 w-80 rounded-[20px] md:ml-5 flex flex-col items-center justify-around"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Emoji skeleton */}
            <div className="flex gap-2 justify-evenly items-center mt-2">
                <motion.div
                    id="emojiSkeleton"
                    className="bg-neutral-600 h-14 w-14 rounded-full animate-pulse"
                ></motion.div>
                {/* Title and date skeleton */}
                <div>
                    <motion.div
                        id="titleSkeleton"
                        className="bg-neutral-600 h-6 w-40 rounded-md mb-2 animate-pulse"
                    ></motion.div>
                    <motion.div
                        id="dateSkeleton"
                        className="bg-neutral-600 h-4 w-32 rounded-md animate-pulse"
                    ></motion.div>
                </div>
                {/* Amount skeleton */}
                <motion.div
                    id="amountSkeleton"
                    className="bg-neutral-600 h-6 w-20 rounded-md animate-pulse"
                ></motion.div>
            </div>

            {/* Progress bar skeleton */}
            <div id="progressBarSkeleton" className="w-[90%] flex flex-col gap-2">
                {/* Spent and remaining labels skeleton */}
                <div className="flex items-center justify-between">
                    <motion.div
                        className="bg-neutral-600 h-4 w-20 rounded-md animate-pulse"
                    ></motion.div>
                    <motion.div
                        className="bg-neutral-600 h-4 w-20 rounded-md animate-pulse"
                    ></motion.div>
                </div>
                {/* Progress bar skeleton */}
                <motion.div
                    className="bg-neutral-600 h-4 w-full rounded-md animate-pulse"
                ></motion.div>
            </div>
        </motion.div>
    );
}

export default BudgetCardSkeleton;
