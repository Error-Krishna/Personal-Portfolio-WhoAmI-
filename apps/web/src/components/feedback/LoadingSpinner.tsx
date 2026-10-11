import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  label,
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`animate-spin text-amber-500 ${sizeClasses[size]}`} />
      {label && <span className="text-sm text-slate-400">{label}</span>}
    </div>
  );
};
