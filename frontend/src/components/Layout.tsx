import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { AIChatBot } from './AIChatBot';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
      {/* Premium Horizontal Navigation Bar */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col relative">
        {/* Subtle decorative background gradient spheres */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-300/20 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 right-1/10 w-[450px] h-[450px] bg-purple-300/20 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-1/10 left-1/3 w-80 h-80 bg-teal-300/10 dark:bg-teal-900/5 rounded-full blur-[80px] pointer-events-none -z-10"></div>

        {/* Dynamic page outlet */}
        <div className="flex-1 page-transition">
          <Outlet />
        </div>
      </main>

      {/* Floating Speech-Enabled AI Chatbot */}
      <AIChatBot />
    </div>
  );
};
