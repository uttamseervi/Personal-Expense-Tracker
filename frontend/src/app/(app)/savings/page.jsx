'use client';
import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Wallet, TrendingUp, PiggyBank } from 'lucide-react';
import axios from 'axios';

const Card = ({ children }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
        {children}
    </div>
);

const SavingsDashboard = () => {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
    }, []);

    useEffect(() => {
        const fetchSavings = async () => {
            try {
                setLoading(true);
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/get_savings/`, {
                    email: user?.email
                });
                
                // Transform the API response to match the expected format
                console.log(response.data.savings)
                const transformedData = response.data.savings.map(saving => ({
                    month: new Date(saving.saving_date).toLocaleString('default', { month: 'short' }),
                    saving_amount: parseFloat(saving.saving_amount),
                    saving_name: saving.saving_name,
                    saving_category: saving.saving_category
                }));
                console.log('transformedData',transformedData)
                setTransactions(transformedData);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching savings:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchSavings();
        }
    }, [user]);

    // Group transactions by month for chart data
    const chartData = React.useMemo(() => {
        const monthlyData = transactions.reduce((acc, transaction) => {
            const month = transaction.month;
            if (!acc[month]) {
                acc[month] = {
                    month: month,
                    savings: 0,
                    income: 0,
                    expenses: 0
                };
            }
            acc[month].savings += transaction.saving_amount;
            return acc;
        }, {});

        return Object.values(monthlyData);
    }, [transactions]);

    // Summary calculations
    const totalSavings = transactions.reduce((sum, item) => sum + item.saving_amount, 0);
    const averageSavings = totalSavings / (chartData.length || 1);
    const lastMonthSavings = chartData[chartData.length - 1]?.savings || 0;

    if (loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <main className="w-screen flex items-center justify-center bg-neutral-300/50 min-h-screen">
            <div className="p-6 space-y-6 w-[80%]">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded">
                                <PiggyBank className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">Total Transactions</p>
                                <h3 className="text-2xl font-bold text-neutral-900">{transactions.length}</h3>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded">
                                <PiggyBank className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">Total Savings</p>
                                <h3 className="text-2xl font-bold text-neutral-900">&#8377;{totalSavings.toFixed(2)}</h3>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Average Monthly</p>
                                <h3 className="text-2xl font-bold text-neutral-900">&#8377; {averageSavings.toFixed(2)}</h3>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded">
                                <Wallet className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Last Month</p>
                                <h3 className="text-2xl font-bold text-neutral-900">&#8377;{lastMonthSavings.toFixed(2)}</h3>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-neutral-900">Savings Trend</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="savings"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-neutral-900">Monthly Savings Distribution</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="savings" fill="#2563eb" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
};

export default SavingsDashboard;