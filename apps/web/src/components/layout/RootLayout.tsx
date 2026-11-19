import React, { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '../feedback/ErrorBoundary.js';

interface RootLayoutProps {
  children?: ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f8f6f0] text-[#0f1117] dark:bg-[#0b0d13] dark:text-[#f1f3f9] flex flex-col font-sans selection:bg-amber-500 selection:text-black transition-colors duration-300">
      <ErrorBoundary>
        <main className="flex-1 w-full">
          {children || <Outlet />}
        </main>
      </ErrorBoundary>
    </div>
  );
};
