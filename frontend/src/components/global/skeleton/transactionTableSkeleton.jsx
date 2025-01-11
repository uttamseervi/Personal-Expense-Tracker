import React from 'react';

const TransactionTableSkeleton = () => {
    const rows = Array.from({ length: 5 }); // Adjust the number of rows for the skeleton

    return (
        <div className="w-[80%] mx-auto rounded-[10px] overflow-hidden border border-gray-300">
            <table className="w-full table-auto">
                <thead>
                    <tr className="bg-gray-300">
                        <th className="px-4 py-2 text-left text-sm font-bold text-gray-600">Name</th>
                        <th className="px-4 py-2 text-left text-sm font-bold text-gray-600">Amount</th>
                        <th className="px-4 py-2 text-left text-sm font-bold text-gray-600">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-bold text-gray-600">Category</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((_, index) => (
                        <tr key={index} className="bg-neutral-100 animate-pulse">
                            <td className="px-4 py-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            </td>
                            <td className="px-4 py-2">
                                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            </td>
                            <td className="px-4 py-2">
                                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                            </td>
                            <td className="px-4 py-2">
                                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTableSkeleton;
