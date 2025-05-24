"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

const Searchsection = ({ onSearchInput }: { onSearchInput: (value: string) => void }) => {
  const [searchValue, setSearchValue] = useState("");
  const isExternalChange = useRef(true);

  // Handle input change
  const handleInputChange = (value: string) => {
    setSearchValue(value);
    onSearchInput(value);
    isExternalChange.current = false; // Mark as user input
    localStorage.setItem("searchValue", value);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedValue = localStorage.getItem("searchValue") || "";
      // Only update if the change was not from this tab/user input
      if (isExternalChange.current) {
        setSearchValue(storedValue);
        onSearchInput(storedValue);
      }
      isExternalChange.current = true;
    };

    // Load initial value
    handleStorageChange();

    // Listen for storage updates from other tabs
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [onSearchInput]);

  return (
    <div className='flex-col p-8 bg-gradient-to-br from-purple-500 via-purple-700 to-blue-500 flex justify-center items-center text-white'>
      <h2 className='text-3xl font-bold'>Browse All Templates</h2> 
      <p>What would you like to create today?</p>
      <div className='w-full flex justify-center items-center'>
        <div className='flex gap-2 my-5 w-[50%] bg-white items-center p-2 border rounded-xl'>
          <Search className='text-primary'/>
          <input 
            type="text" 
            className='w-full text-gray-700 outline-none' 
            value={searchValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder='Search' 
          />
        </div>
      </div>
    </div>
  );
};

export default Searchsection;
