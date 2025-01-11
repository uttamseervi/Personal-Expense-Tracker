'use client';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/userSlice"; // Import the login action

const SyncAuthFromLocalStorage = () => {
    const dispatch = useDispatch(); 

    useEffect(() => {
        const syncAuthState = () => {
            const user = JSON.parse(localStorage.getItem('user')); 
            if (user) {
                dispatch(login(user)); 
            }
        };

        syncAuthState();

        const handleWindowReload = () => {
            syncAuthState(); 
        };

        // Add event listener for page reload
        window.addEventListener('beforeunload', handleWindowReload);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('beforeunload', handleWindowReload);
        };
    }, [dispatch]);

    return null; 
};

export default SyncAuthFromLocalStorage;
