'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
const SigninButton = () => {
    const router = useRouter()
    return (
        <>
            <div className="bg-black text-white h-screen w-screen flex items-center justify-center flex-col">
                <h1 className="text-xl font-bold mb-1">You are not logged in</h1>
                <h2 className="text-xl font-bold mb-1">Please log in to view the content</h2>
                <button
                    className='bg-white p-2 rounded-md text-black'
                    onClick={() => router.push('/signin')}
                >
                    Signin
                </button>
            </div>
        </>
    )
}

export default SigninButton
