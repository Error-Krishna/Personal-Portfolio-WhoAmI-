import React, { type ReactNode } from 'react';
import { ErrorBoundary } from '../components/feedback/ErrorBoundary.js';
import { ThemeProvider } from '../context/ThemeContext.js';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>{children}</ThemeProvider>
    </ErrorBoundary>
  );
};
