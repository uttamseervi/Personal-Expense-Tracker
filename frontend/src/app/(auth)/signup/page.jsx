"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
    IconBrandGithub,
    IconBrandGoogle,
    IconBrandOnlyfans,
} from "@tabler/icons-react";

export default function SignupFormDemo() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        monthly_income: "",
        phone_number: "", // Added phone number field
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/signup/`,
                formData
            );
            setSuccess("Account created successfully! You can now log in.");
            setFormData({
                username: "",
                email: "",
                password: "",
                monthly_income: "",
                phone_number: "", // Reset phone number field
            });
            confirm("Account created successfully! You can now log in.");
            router.push("/signin");
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error("Signup error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="flex items-center justify-center md:mt-10 h-screen mt-10 bg-neutral-300/50">
            <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-neutral-200 dark:bg-black">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                    Welcome to Money Mentor
                </h2>
                <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                    Create an account to get started with Money Mentor.
                </p>
                <form className="my-8" onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="username">User Name</Label>
                        <Input
                            id="username"
                            name="username"
                            placeholder="Uttam Seervi"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>

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

                    {/* Monthly Income Field */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="monthly_income">Monthly Income</Label>
                        <Input
                            id="monthly_income"
                            name="monthly_income"
                            placeholder="Enter your monthly income"
                            type="number"
                            value={formData.monthly_income}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>

                    {/* Phone Number Field */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input
                            id="phone_number"
                            name="phone_number"
                            placeholder="Enter your phone number"
                            type="tel" // Use 'tel' for phone number input
                            value={formData.phone_number}
                            onChange={handleChange}
                        />
                    </LabelInputContainer>

                    {/* Error and Success Messages */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}

                    {/* Submit Button */}
                    <button
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "Sign up →"}
                        <BottomGradient />
                    </button>

                    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                    {/* Navigation Link */}
                    <p className="text-center text-sm text-neutral-600 dark:text-neutral-300">
                        Already a user?{" "}
                        <button
                            type="button"
                            onClick={() => router.push("/signin")}
                            className="text-blue-500 hover:underline"
                        >
                            Sign in
                        </button>
                    </p>
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
