"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

type ContentContextType = {
  contentCount: number;
  setContentCount: (count: number | ((prev: number) => number)) => void;
  fetchContentCount: () => Promise<void>;
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const [contentCount, setContentCount] = useState(0);

  const fetchContentCount = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`/api/content-usage?userId=${user.id}`);
      const data = await res.json();
      setContentCount(data.totalGenerated || 0);
    } catch (error) {
      console.error("Failed to fetch content count:", error);
    }
  };

  useEffect(() => {
    if (isLoaded && user?.id) {
      fetchContentCount();
    }
  }, [isLoaded, user?.id]);

  return (
    <ContentContext.Provider value={{ contentCount, setContentCount, fetchContentCount }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used within a ContentProvider");
  return context;
};
