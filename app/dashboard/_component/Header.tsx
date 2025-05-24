"use client";
import { UserButton } from "@clerk/nextjs";
import {
  Search,
  FileClock,
  Home,
  Settings,
  WalletCards,
  CreditCard,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UsageTrack from "./UsageTrack";
import { useContent } from '../../../utils/contexts/ContentContext';
import { useUser } from "@clerk/nextjs";

const MenuList = [
  {
    name: "Home",
    icon: Home,
    path: "/dashboard",
  },
  {
    name: "History",
    icon: FileClock,
    path: "/dashboard/history",
  },
  {
    name: "Billing",
    icon: WalletCards,
    path: "/dashboard/billing",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

const Header = () => {
  const { contentCount } = useContent();
  const { user } = useUser();

  const [searchInput, setSearchInput] = useState("");
  const [isUsageOpen, setIsUsageOpen] = useState(false);
  const usageRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (searchInput.length > 0) {
      router.push("/dashboard");
    }
    localStorage.setItem("searchValue", searchInput);
  }, [searchInput, router]);

  // Close UsageTrack when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        usageRef.current &&
        !(usageRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsUsageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="p-5 flex bg-white justify-between shadow-sm border-b-2 items-center relative">
        {/* Search */}
        <div className="flex gap-2 p-2 rounded-md border max-w-lg">
          <Search />
          <input
            type="text"
            placeholder="search..."
            className="outline-none"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Right section */}
        <div className="flex gap-3 items-center relative">
          <div className="bg-primary sm:block hidden p-1 py-2 text-xs text-white rounded-full">
            🔥 Join Membership for just $9.99/month
          </div>

          {/* Toggle Credit Usage */}
          <div ref={usageRef} className=" block sm:hidden relative">
            <CreditCard
              size={35}
              className="cursor-pointer text-primary border rounded-full p-1 "
              onClick={() => setIsUsageOpen(!isUsageOpen)}
            />
            {isUsageOpen && (
              <div className="absolute top-10 right-0  z-50">
                 <UsageTrack userId={user?.primaryEmailAddressId || ""} />
              </div>
            )}
          </div>

          <UserButton />
        </div>
      </div>

      {/* Mobile Navigation - Fixed Bottom */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-white border-t py-3 shadow-md">
        {MenuList.filter((item) => item.name !== "Home").map((item) => (
          <Link
            href={item.path}
            key={item.name}
            className="flex flex-col items-center text-xs text-gray-700 hover:text-primary"
          >
            <item.icon className="h-5 w-5 mb-1 text-primary" />
            {item.name}
          </Link>
        ))}
      </div>
    </>
  );
};

export default Header;
