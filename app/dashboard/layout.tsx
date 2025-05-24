import React from "react";
import SideNav from "./_component/SideNav";
import Header from "./_component/Header";
import { ContentProvider } from '../../utils/contexts/ContentContext';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
     <ContentProvider>
    <div className="bg-slate-100 h-screen">
      <div className="md:w-64 hidden md:block fixed">
        <SideNav />
      </div>
      <div className="md:ml-64">
        <Header />
        {children}
        </div>
    </div>
    </ContentProvider>
  );
};

export default layout;
