'use client';
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SidebarDemo } from "@/components/global/sidebar";
import { Provider } from "react-redux";
import store from "@/store/store";
import { useRouter } from "next/navigation";

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const noSidebarPages = ["/", "/signin", "/signup"];
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [isCheckingUser, setIsCheckingUser] = useState(true); // Track if the user check is in progress

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        setUser(storedUser ? JSON.parse(storedUser) : null);
        setIsCheckingUser(false); // After fetching the user, stop checking
    }, []);

    useEffect(() => {
        if (isCheckingUser) return;

        if (!user && !noSidebarPages) {
            const timeoutId = setTimeout(() => {
                alert('Please sign in to continue');
                router.push('/signin');
            }, 3000); 

            return () => clearTimeout(timeoutId); 
        }
    }, [user, isCheckingUser, router]);

    return (
        <Provider store={store}>
            {noSidebarPages.includes(pathname) ? (
                children
            ) : (
                <div className="flex flex-row">
                    <SidebarDemo>
                        {children}
                    </SidebarDemo>
                </div>
            )}
        </Provider>
    );
}
