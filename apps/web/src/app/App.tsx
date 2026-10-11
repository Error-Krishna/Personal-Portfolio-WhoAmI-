import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.js';
import { AppProviders } from './providers.js';

export const App: React.FC = () => {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
};

export default App;
