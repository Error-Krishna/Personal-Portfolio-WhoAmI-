import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../components/layout/RootLayout.js';
import { HomePage } from '../pages/HomePage.js';
import { ProjectDetailPage } from '../pages/ProjectDetailPage.js';
import { ResumePage } from '../pages/ResumePage.js';
import { NotFoundPage } from '../pages/NotFoundPage.js';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'work/:slug',
        element: <ProjectDetailPage />,
      },
      {
        path: 'project/:slug',
        element: <ProjectDetailPage />,
      },
      {
        path: 'resume',
        element: <ResumePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
