"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { FileClock, Home, Settings, WalletCards } from "lucide-react";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import UsageTrack from "./UsageTrack";
import { useContent } from '../../../utils/contexts/ContentContext';

import { useUser } from "@clerk/nextjs";



const SideNav = () => {

const { contentCount } = useContent();
const { user } = useUser();

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

  const path = usePathname();
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    console.log(path);
  });

  const handleNavigation = (path: string) => {
    router.push(path); // Navigate to the selected path
  };

  useEffect(() => {
  console.log("User ID:", user?.primaryEmailAddressId);
  
}, [user]);

  return (
    <div className="h-screen relative p-5 shadow-sm border bg-white">
      <div className="flex justify-center border-bottom">
        <Image src={"/logo.svg"} alt="logo" width={120} height={120} />
      </div>
      <hr className="mt-6 h-2" />
      <div className="mt-10">
        {MenuList.map((menu, index) => {
          const Icon = menu.icon;
          return (
            <div
              key={index}
              onClick={() => handleNavigation(menu.path)} // Add onClick handler
              className={`flex items-center mb-2 gap-3 p-2 hover:bg-primary hover:text-white rounded-lg cursor-pointer ${
                path === menu.path && "bg-primary text-white"
              }`}
            >
              <Icon size={20} />
              <span>{menu.name}</span>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-10 left-0 w-full ">
      <UsageTrack userId={user?.primaryEmailAddressId || ""} />

      </div>
    </div>
  );
};

export default SideNav;