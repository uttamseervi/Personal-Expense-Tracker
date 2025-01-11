'use client'
import { useEffect, useState } from 'react';
import { PlaidLink } from 'react-plaid-link';

const PlaidLinkButton = () => {
    const [linkToken, setLinkToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Step 1: Fetch the link token from your backend
    const fetchLinkToken = async () => {
        try {
            const response = await fetch('/api/plaid/create-link-token');
            const data = await response.json();
            setLinkToken(data.link_token);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching link token', err);
            setError('Failed to load Plaid Link');
            setLoading(false);
        }
    };

    // Initialize the link token when the component mounts
    useEffect(() => {
        fetchLinkToken();
    }, []);

    // Step 2: Handle success from Plaid Link
    const handleOnSuccess = async (public_token, metadata) => {
        try {
            // Send the public token to your Django backend to exchange for access token
            const response = await fetch('/api/plaid/exchange-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ public_token }),
            });

            const data = await response.json();
            if (data.access_token) {
                // Do something with the access token (e.g., store it, show success message)
                console.log('Access token:', data.access_token);
            } else {
                setError('Failed to exchange the public token');
            }
        } catch (err) {
            console.error('Error exchanging public token', err);
            setError('Failed to exchange public token');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {linkToken ? (
                <div className='bg-black text-white'>
                    <PlaidLink

                        token={linkToken}
                        onSuccess={handleOnSuccess}
                        onExit={(error) => setError(error ? error.message : 'Exited')}
                    >
                        Link your bank account
                    </PlaidLink>
                </div>
            ) : (
                <div>Loading Plaid Link...</div>
            )}
        </div>
    );
};

export default PlaidLinkButton;
