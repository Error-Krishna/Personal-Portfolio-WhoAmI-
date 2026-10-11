import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { ApiErrorDetail } from '@portfolio/contracts';

interface ErrorMessageProps {
  message: string;
  code?: string;
  details?: ApiErrorDetail[];
  className?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  code,
  details,
  className = '',
  onRetry,
}) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`rounded-xl border border-red-500/20 bg-red-950/30 p-4 text-red-200 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
        <div className="flex-1 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-white">{message}</span>
            {code && (
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-red-900/60 text-red-300 border border-red-700/50">
                {code}
              </span>
            )}
          </div>

          {details && details.length > 0 && (
            <ul className="mt-2.5 list-disc list-inside space-y-1 text-xs text-red-300/90 pl-1">
              {details.map((detail, idx) => (
                <li key={idx}>
                  {detail.field ? <strong className="text-red-200">{detail.field}: </strong> : null}
                  {detail.message}
                </li>
              ))}
            </ul>
          )}

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 text-xs font-semibold underline text-amber-400 hover:text-amber-300"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
