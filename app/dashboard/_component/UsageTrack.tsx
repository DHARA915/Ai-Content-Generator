

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const UsageTrack = ({ userId }: { userId: string }) => {
  const [contentGenerated, setContentGenerated] = useState(0);
  const [usagePercentage, setUsagePercentage] = useState(0);
  const totalCredits = 100;
  const creditsRemaining = totalCredits - contentGenerated;
   const [error, setError] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

useEffect(() => {
  async function fetchUsage() {
    try {
      setIsLoading(true);
      console.log("Fetching usage for userId:", userId);

      const res = await fetch(`/api/content-usage?userId=${encodeURIComponent(userId)}`);
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      console.log("API response data:", data);

      const generated = data.totalGenerated || 0;
      setContentGenerated(generated);

      const percentage = Math.min(100, (generated / totalCredits) * 100);
      setUsagePercentage(percentage);

      setError(null);
    } catch (err) {
      console.error("Failed to fetch usage:", err);
      setError("Failed to load usage data");
      setContentGenerated(0);
      setUsagePercentage(0);
    } finally {
      setIsLoading(false);
    }
  }

  if (userId) {
    fetchUsage();
  } else {
    console.warn("No userId provided to UsageTrack component");
    setError("No user identifier provided");
    setIsLoading(false);
  }
}, [userId]);




  const handleButtonClick = () => {
    router.push('/dashboard/billing');
  };

  return (
    <div className='m-5'>
      <motion.div 
        className='bg-gradient-to-r from-primary to-[#7e5afd] text-white rounded-lg p-4 shadow-lg'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className='flex justify-between items-center mb-2'>
          <h2 className='font-medium text-lg'>Content Usage</h2>
          <span className='text-sm font-semibold'>
            {creditsRemaining}/{totalCredits} remaining
          </span>
        </div>

        <div className='relative h-3 bg-[#9981f9] mt-2 w-full rounded-full overflow-hidden'>
          <motion.div 
            className='absolute top-0 left-0 h-full bg-white rounded-full'
            initial={{ width: 0 }}
            animate={{ width: `${usagePercentage}%` }}
            transition={{ duration: 1, type: 'spring' }}
          />
        </div>

        <div className='flex justify-between mt-2 text-xs'>
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>

        <div className='mt-2 text-center text-xs'>
          Generated: {contentGenerated} content items
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className='mt-4 w-full py-2 bg-white text-primary rounded-md font-medium text-sm'
          onClick={handleButtonClick}
        >
          {creditsRemaining <= 0 ? 'Get More Credits' : 'Upgrade Plan'}
        </motion.button>

        {creditsRemaining <= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-center text-xs text-yellow-200"
          >
            All credits used. Redirecting to billing...
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default UsageTrack;
