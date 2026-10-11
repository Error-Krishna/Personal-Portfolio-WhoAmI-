import React, { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '../feedback/ErrorBoundary.js';

interface RootLayoutProps {
  children?: ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <ErrorBoundary>
        <main className="flex-1 w-full">
          {children || <Outlet />}
        </main>
      </ErrorBoundary>
    </div>
  );
};
