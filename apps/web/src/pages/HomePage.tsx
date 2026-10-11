import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/api/client.js';
import { getErrorMessage } from '../lib/api/errors.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { ErrorMessage } from '../components/feedback/ErrorMessage.js';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner.js';
import { Activity, ShieldCheck, CheckCircle2, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import type { HealthCheckResponse } from '@portfolio/contracts';

export const HomePage: React.FC = () => {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [testErrorResponse, setTestErrorResponse] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState<boolean>(false);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<HealthCheckResponse>('/health');
      setHealth(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const triggerTestError = async () => {
    setTestLoading(true);
    setTestErrorResponse(null);
    try {
      // Intentionally call a non-existent route to show consistent 404 error handling
      await apiClient.get('/non-existent-test-endpoint');
    } catch (err) {
      setTestErrorResponse(getErrorMessage(err));
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-center">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
          <Layers className="w-3.5 h-3.5" />
          MERN Production Monorepo
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight">
          Krishna Goyal <span className="text-amber-400">Portfolio</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Full-stack production setup with Turbo monorepo, strict TypeScript, React + Vite, Express,
          standardized contracts, and unified error handling across frontend and backend.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* API & Backend Status Card */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-mono font-semibold text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Backend Status
              </span>
              {loading ? (
                <span className="text-xs text-slate-400">Connecting...</span>
              ) : health ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  {health.status.toUpperCase()}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <AlertTriangle className="w-3 h-3" />
                  Offline
                </span>
              )}
            </div>

            {loading && <LoadingSpinner className="py-8" label="Querying /api/v1/health..." />}

            {error && (
              <ErrorMessage
                message={error}
                className="my-2"
                onRetry={fetchHealth}
              />
            )}

            {health && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-300">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-mono text-emerald-400">Express API</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-300">
                  <span className="text-slate-500">Database:</span>
                  <span className="font-mono text-slate-200">{health.services.database.status}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-300">
                  <span className="text-slate-500">Server Uptime:</span>
                  <span className="font-mono text-slate-200">{Math.round(health.uptime)}s</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span className="text-slate-500">Environment:</span>
                  <span className="font-mono text-amber-400">{health.environment}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-500">Endpoint: /api/v1/health</span>
            <Button variant="outline" size="sm" onClick={fetchHealth} isLoading={loading}>
              Refresh Health
            </Button>
          </div>
        </Card>

        {/* Error Handling Verification Card */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-mono font-semibold text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Error Handling System
              </span>
              <span className="text-xs text-slate-500 font-mono">Standard Envelope</span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Every backend error is parsed into a unified JSON format with requestId, status code,
              error code, and structured validation details. Frontend interceptors automatically
              parse and present human-readable messages.
            </p>

            {testErrorResponse && (
              <ErrorMessage
                message={testErrorResponse}
                code="API_ERROR"
                className="my-3"
              />
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-500">Test 404 Route handling</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={triggerTestError}
              isLoading={testLoading}
            >
              Simulate API Error
            </Button>
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <span>Ready for Hero & Left Sidebar UI integration</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
