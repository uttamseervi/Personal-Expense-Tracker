"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    IconLogout2,
    IconBrandTabler,
    IconPingPong,
    IconUserBolt,
    IconMapDollar
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { logout } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";

export function SidebarDemo({ children }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const isAuthenticated = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logout/`);
            dispatch(logout());
            localStorage.removeItem("user");
            router.push("/");
        } catch (error) {
            setError(`An error occurred. Please try again. ${error}`);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10 border-r-2 bg-[#e4e0e1b8]/30 text-[#4A4947]">
                    <div className="flex flex-col flex-1">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                            {isAuthenticated && (
                                <SidebarLink
                                    link={{
                                        label: "Logout",
                                        href: "#",
                                        icon: <IconLogout2 className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
                                    }}
                                    onClick={handleLogout}
                                />
                            )}
                        </div>
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="flex flex-col">
                <header className="bg-[#e4e0e1b8]/30  text-black font-bold p-4  items-center justify-between border-b">
                    <h2>Track Your Expenses Here</h2>
                </header>
                <section className="overflow-y-auto bg-[#FAF7F0]">
                    <div className="h-full">
                        {children}
                    </div>
                </section>
            </div>
        </div>
    );
}

export const Logo = () => (
    <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-[#3F3F44] py-1 relative z-20">
        <div className="h-5 w-6 bg-black rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-sans text-blue-600 font-bold whitespace-pre">
            MMentor
        </motion.span>
    </Link>
);


const links = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: <IconBrandTabler className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
    {
        label: "Budgets",
        href: "/budgets",
        icon: <IconPingPong className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
    {
        label: "Income",
        href: "/income",
        icon: <IconMapDollar className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
    {
        label: "Savings",
        href: "/savings",
        icon: <IconUserBolt className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    }
];

export const LogoIcon = () => (
    <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
        <div className="h-5 w-6 bg-blue-500 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
);