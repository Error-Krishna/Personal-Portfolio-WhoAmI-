import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import { Button } from '../components/ui/Button.js';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-400 mb-6 border border-amber-500/20">
          <Compass className="w-10 h-10 animate-spin [animation-duration:10s]" />
        </div>
        <h1 className="text-6xl font-black font-heading text-white tracking-tight mb-2">404</h1>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Page Not Found</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          The requested page doesn't exist or has been moved to another URL.
        </p>
        <Link to="/">
          <Button variant="primary" size="md">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
