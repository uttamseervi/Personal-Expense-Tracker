import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SuggestionBoxSkeleton from '../skeleton/suggetionBoxSkeleton';
import Typewriter from 'typewriter-effect/dist/core';

const SuggestionBox = ({total_spent_amount,total_savings_amount}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const typewriterRef = useRef(null);

    useEffect(() => {
        const getSuggestions = async () => {
            setLoading(true);
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/get_suggestions/`,{
                    prompt: `based on my ${total_savings_amount} savings and ${total_spent_amount} spent this month give me some suggestion to save more money and spend less and efficiently in 4 0r 5 lines and show the saving amount(rupees) and spent amount(rupees) in the response`,
                });
                setSuggestions(response.data.response || []);
                setLoading(false);
            } catch (err) {
                setError('An error occurred while fetching suggestions');
                console.error(err);
                setLoading(false);
            }
        };

        getSuggestions();
    }, [total_spent_amount,total_savings_amount]);

    useEffect(() => {
        if (suggestions.length > 0 && typewriterRef.current) {
            new Typewriter(typewriterRef.current, {
                strings: suggestions,
                autoStart: true,
                delay:-30,
                pauseFor:10000000,
                loop:false,

            });
        }
    }, [suggestions]);

    return (
        <div id="suggestionBox" className="p-6 mx-auto h-60 overflow-y-auto bg-[#FAF7F0]  rounded-lg w-[90%] mt-5">
            <h1 className="font-bold text-2xl font-sans">Your Personal Money Mentor</h1>

            {loading && <SuggestionBoxSkeleton />}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <span
                    ref={typewriterRef}
                    id="typewriter"
                    className="font-normal font-sans text-neutral-800"
                ></span>
            )}
        </div>
    );
};

export default SuggestionBox;
