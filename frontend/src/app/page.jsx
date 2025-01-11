'use client';
import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    const handleSignupClick = () => {
        router.push('/signup');
    };

    const handleSigninClick = () => {
        router.push('/signin');
    };

    return (
        <BackgroundLines className="flex items-center justify-center w-full h-screen flex-col px-4">
            <div className="absolute top-5 flex gap-4 right-7">
                <button
                    onClick={handleSignupClick}
                    className="bg-gray-900 px-3 py-2 rounded-md text-white font-bold hover:bg-neutral-900 hover:text-white"
                >
                    Signup
                </button>
                <button
                    onClick={handleSigninClick}
                    className="bg-gray-900 px-3 py-2 rounded-md text-white font-bold hover:bg-neutral-900 hover:text-white"
                >
                    Signin
                </button>
            </div>
            <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
                Welcome to, <br /> Money Mentor.
            </h2>
            <p className="max-w-xl mx-auto text-sm md:text-[15px] text-neutral-400 text-center">
                Take control of your finances with Money Mentor, an AI-driven personal finance tracker designed to help you manage your budget, track expenses, and make smart financial decisions. Receive personalized suggestions based on your spending habits and financial goals, all in one easy-to-use platform. Get expert advice from our AI assistant and optimize your financial future today.
            </p>
        </BackgroundLines>
    );
}
