import React from 'react';

const SuggestionBoxSkeleton = () => {
    return (
        <div className="p-6 mx-auto h-20 overflow-hidden  bg-transparent backdrop-blur-md rounded-lg w-[90%] mt-5 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-5 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-11/12 mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-10/12 mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-9/12"></div>
        </div>
    );
};

export default SuggestionBoxSkeleton;
