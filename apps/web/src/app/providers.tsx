import React, { type ReactNode } from 'react';
import { ErrorBoundary } from '../components/feedback/ErrorBoundary.js';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};
