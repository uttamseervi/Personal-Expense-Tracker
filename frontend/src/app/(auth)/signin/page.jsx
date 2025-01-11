"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import { login } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux"

import {
    IconBrandGithub,
    IconBrandGoogle,
    IconBrandOnlyfans,
} from "@tabler/icons-react";

export default function LoginForm() {
    const router = useRouter(); // Initialize useRouter for navigation
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(""); // Store error message
    const [loading, setLoading] = useState(false); // Handle loading state

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form default behavior
        setLoading(true); // Start loading state
        setError(""); // Reset error message on form submission

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/login/`,
                formData
            );            
            if (response.data) {
                // Save user data to localStorage
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Dispatch login action to store user in Redux
                dispatch(login(response.data.user));

                // Redirect to dashboard
                router.push("/dashboard");
            } else {
                setError("Invalid email or password.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error("Login error", err);
        } finally {
            setLoading(false);
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="flex items-center justify-center md:mt-16 mt-36 bg-neutral-300/50 h-screen">
            <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-neutral-200 dark:bg-black">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                    Welcome to Money Mentor
                </h2>
                <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                    Login to Money Mentor if you can because we don&apos;t have a login flow
                    yet
                </p>
                <form className="my-8" onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="projectmayhem@fc.com"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>

                    {/* Password Field */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Submit Button */}
                    <button
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Sign in →"}
                        <BottomGradient />
                    </button>

                    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                </form>
            </div>
        </div>
    );
}

// Bottom Gradient for Button
const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

// Label and Input Container
const LabelInputContainer = ({ children, className }) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};
