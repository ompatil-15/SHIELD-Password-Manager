import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentBanner = () => {
    const navigate = useNavigate();
    return (
        <div className="mt-2 w-full max-w-2xl bg-gradient-to-r from-purple-600 to-violet-900 text-white p-2 sm:rounded-md shadow-lg flex justify-between items-center">
            <div className="flex items-center">
                <img src="/premium.svg" alt="Premium Icon" className="w-10 h-10 mr-2"/>
                <div>
                    <h2 className="text-md lg:text-xl font-bold">Upgrade to Premium</h2>
                    <p className="hidden sm:block text-xs lg:sm font-semibold">
                        Unlock lifetime security with a one-time payment
                    </p>
                </div>
            </div>
            <div className="flex items-center">
                <button 
                    className="bg-yellow-500 hover:bg-yellow-400 text-violet-700 text-xs lg:text-sm font-bold py-2 px-4 rounded-md mr-2"
                    onClick={() => navigate("/premium")}
                >
                    Buy Premium 
                </button>
            </div>
        </div>
    );
};

export default PaymentBanner;
