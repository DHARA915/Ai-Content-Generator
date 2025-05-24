"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft, ChevronDown, ChevronUp, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../utils/db";
import { AIOutput } from "../../../utils/Schema";
import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { useEffect } from "react";
import moment from "moment";
import Templates from "../../(data)/Templates";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from '../../../utils/contexts/ContentContext';

type AIOutputType = InferSelectModel<typeof AIOutput>;

interface HistoryItem extends AIOutputType {
  templateName: string;
  formattedDate: string;
  timestamp: number;
  isExpanded: boolean;
}

const HistoryPage = () => {
  const { user } = useUser();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [uiOnlyDeletion, setUiOnlyDeletion] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [contentCount, setContentCount] = useState(0);
  const { contentCount, setContentCount } = useContent();

  const renderTextWithoutTags = (html: string | null) => {
    if (!html) return '';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    let text = tempDiv.textContent || tempDiv.innerText || '';
    text = text.replace(/\n/g, '\n\n');
    
    const lis = tempDiv.querySelectorAll('li');
    lis.forEach(li => {
      text = text.replace(li.textContent || '', `• ${li.textContent}`);
    });
    
    return text;
  };




// useEffect(() => {
//   const fetchHistory = async () => {
//     if (!user?.primaryEmailAddressId) return;

//     setLoading(true);
//     try {
//       const data = await db
//         .select()
//         .from(AIOutput)
//         .where(eq(AIOutput.createdBy, user.primaryEmailAddressId));

//       // Initialize count from database if localStorage is empty
//       if (data.length > 0 && contentCount === 0) {
//         setContentCount(data.length);
//       }

//       // Transform and set the history data
//       const enrichedData = data.map((item) => {
//         const template = Templates.find((t) => t.slug === item.templateSlug);
//         const date = moment(item.createdAt);
//         return {
//           ...item,
//           templateName: template?.name || "Unknown Template",
//           formattedDate: date.format("MMM D, YYYY h:mm A"),
//           timestamp: date.valueOf(),
//           isExpanded: false,
//         };
//       }).sort((a, b) => b.timestamp - a.timestamp);

//       setHistory(enrichedData);

//     } catch (error) {
//       console.error("Error fetching history:", error);
//       toast.error("Failed to load history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchHistory();
// }, [user?.primaryEmailAddressId, contentCount, setContentCount]);


useEffect(() => {
  const fetchHistory = async () => {
    if (!user?.primaryEmailAddressId) return;

    setLoading(true);
    try {
      const data = await db
        .select()
        .from(AIOutput)
        .where(eq(AIOutput.createdBy, user.primaryEmailAddressId));

      // Get hidden IDs from localStorage
      const hiddenIds = JSON.parse(localStorage.getItem('hiddenHistoryIds') || '[]');

      // Filter out hidden items
      const visibleData = data.filter(item => !hiddenIds.includes(item.id));

      // Transform and set history (only visible items)
      const enrichedData = visibleData.map((item) => ({
        ...item,
        templateName: Templates.find((t) => t.slug === item.templateSlug)?.name || "Unknown Template",
        formattedDate: moment(item.createdAt).format("MMM D, YYYY h:mm A"),
        timestamp: moment(item.createdAt).valueOf(),
        isExpanded: false,
      })).sort((a, b) => b.timestamp - a.timestamp);

      setHistory(enrichedData);

    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  fetchHistory();
}, [user?.primaryEmailAddressId, contentCount, setContentCount]);
  const toggleExpand = (id: number) => {
    setHistory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  const copyToClipboard = (text: string | null) => {
    if (!text) {
      toast.error("No content to copy");
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      description: "The content is ready to be pasted anywhere you need.",
      action: {
        label: "Dismiss",
        onClick: () => toast.dismiss(),
      },
      style: {
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
        color: 'white',
        border: 'none'
      },
      position: 'top-right'
    });
  };

const deleteHistoryItem = async (id: number) => {
  // 1. Get currently hidden IDs from localStorage
  const hiddenIds = JSON.parse(localStorage.getItem('hiddenHistoryIds') || '[]');

  // 2. Add the new ID to the hidden list (if not already there)
  if (!hiddenIds.includes(id)) {
    const updatedHiddenIds = [...hiddenIds, id];
    localStorage.setItem('hiddenHistoryIds', JSON.stringify(updatedHiddenIds));
  }

  // 3. Optimistically update UI
  setHistory(prev => prev.filter(item => item.id !== id));

  toast.success("History item hidden", {
    description: "This item will not appear again unless manually restored.",
    style: {
      background: 'linear-gradient(90deg, #ef4444, #dc2626)',
      color: 'white',
      border: 'none',
    },
  });
};

  const cardGradients = [
    'from-indigo-500 via-purple-500 to-pink-500',
    'from-blue-500 via-indigo-500 to-purple-600',
    'from-violet-500 via-fuchsia-500 to-pink-500',
    'from-indigo-600 via-purple-600 to-pink-600'
  ];

  const getRandomGradient = (id: number) => {
    return cardGradients[id % cardGradients.length];
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:flex xs:flex-col items-center justify-between mb-10"
        >
         

          <Link href="/dashboard" className="ml-4">
            <Button 
              variant="ghost" 
              className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
            >
              <ArrowLeft className="mr-2  group-hover:-translate-x-1 transition-transform" size={18} />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400">Back to Dashboard</span>
            </Button>
          </Link>
          <motion.h1 
            className="text-4xl  font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Generation History
          </motion.h1>
          
          <div className="w-24"></div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 1.5,
                ease: "linear"
              }}
              className="relative w-24 h-24"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 left-0 w-full h-full"
                  animate={{
                    rotate: i * 60,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "linear"
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 mx-auto"></div>
                </motion.div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        ) : history.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="mx-auto w-48 h-48 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            >
              <svg
                className="w-24 h-24 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </motion.div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No history yet
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Your generated content will appear here once you create some magic!
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <AnimatePresence>
              {history.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-gradient-to-r ${getRandomGradient(item.id)} rounded-xl shadow-lg overflow-hidden backdrop-blur-sm`}
                >
                  <motion.div 
                    className="p-5 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpand(item.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {item.templateName}
                      </h3>
                      <p className="text-sm text-white/80">
                        {item.formattedDate}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-white/10 hover:bg-white/20 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(item.aiResponse);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-white/10 hover:bg-white/20 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHistoryItem(item.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      {item.isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-white/80" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-white/80" />
                      )}
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {item.isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/10 backdrop-blur-lg"
                      >
                        <div className="p-5">
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-white/80 mb-2">
                              Input Data:
                            </h4>
                            <div className="bg-black/20 p-4 rounded-lg mb-4 overflow-x-auto">
                              <pre className="text-sm text-white/90 whitespace-pre-wrap">
                                {JSON.stringify(JSON.parse(item.formdata), null, 2)}
                              </pre>
                            </div>

                            <h4 className="text-sm font-medium text-white/80 mb-2">
                              AI Response:
                            </h4>
                            <div className="bg-black/30 p-4 rounded-lg">
                              <p className="text-white/90 whitespace-pre-wrap">
                                {item.aiResponse ? renderTextWithoutTags(item.aiResponse) : 'No response content'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;