"use client";

import { useState } from 'react';
import axios from 'axios';
import { loadRazorpay } from '@/lib/razorpay'

const BillingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'monthly'>('free');
  const [loading, setLoading] = useState(false);

  const handleSubscription = async () => {
    if (selectedPlan === 'free') {
      // Handle free plan selection
      return;
    }

    setLoading(true);
    
    try {
      // Step 1: Create an order on your server
      const response = await axios.post('/api/create-order', {
        plan: 'monthly',
        amount: 90099, // ₹29.99
      });

      const { order_id } = response.data;

      // Step 2: Load Razorpay script
      await loadRazorpay();

      // Step 3: Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: '2999',
        currency: 'INR',
        name: 'AI Content Generation',
        description: 'Monthly Subscription',
        image: '/logo.png',
        order_id: order_id,
        handler: async function(response: any) {
          // Verify payment on your server
          await axios.post('/api/verify-payment', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
          
          // Update user subscription status
          alert('Payment successful!');
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#6d28d9' // violet-700
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 pb-28">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-violet-800 mb-8">Choose Your Plan</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div 
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all 
              ${selectedPlan === 'free' ? 'border-pink-600 bg-pink-50' : 'border-gray-200'}`}
            onClick={() => setSelectedPlan('free')}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-pink-700">Free Plan</h2>
              <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                ₹0/month
              </span>
            </div>
            <p className="text-gray-600 mb-4">Perfect for trying out basic features</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                100 AI content generations
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Basic content templates
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Standard quality output
              </li>
            </ul>
          </div>
          
          {/* Monthly Plan */}
          <div 
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all 
              ${selectedPlan === 'monthly' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-blue-700">Pro Plan</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                $9.99/month
              </span>
            </div>
            <p className="text-gray-600 mb-4">Unlock unlimited AI content generation</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Unlimited AI content generations
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Premium content templates
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                High quality output
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Priority support
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8">
          <button
            onClick={handleSubscription}
            disabled={loading}
            className={`w-full  md:w-auto px-6 py-3 rounded-lg font-medium text-white transition-all
              ${selectedPlan === 'free' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-violet-600 hover:bg-violet-700'}
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : selectedPlan === 'free' ? 'Continue with Free Plan' : 'Subscribe to Pro Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;