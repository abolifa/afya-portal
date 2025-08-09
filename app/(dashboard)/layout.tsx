import Navbar from "@/components/navbar";
import React from "react";
import "leaflet/dist/leaflet.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 px-4 sm:px-6 md:px-10 lg:px-32 py-3 bg-accent">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
