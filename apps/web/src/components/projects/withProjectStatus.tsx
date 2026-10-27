import React from 'react';
import { type ProjectItem } from '../../lib/config/site-config.js';

/**
 * Controlled union of supported project statuses.
 */
export type ProjectStatus = 'in-development' | 'prototype' | 'completed';

/**
 * Human-readable display labels for project statuses.
 */
export const STATUS_DISPLAY_LABELS: Record<ProjectStatus, string> = {
  'in-development': 'In Development',
  prototype: 'Prototype',
  completed: 'Completed',
};

/**
 * Normalizes raw project status strings from metadata into controlled ProjectStatus keys.
 * Returns undefined if the status cannot be verified or mapped.
 */
export const normalizeProjectStatus = (rawStatus?: string | null): ProjectStatus | undefined => {
  if (!rawStatus || typeof rawStatus !== 'string') return undefined;
  const normalized = rawStatus
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-');

  if (
    normalized === 'in-development' ||
    normalized === 'active-development' ||
    normalized === 'in-progress' ||
    normalized === 'active'
  ) {
    return 'in-development';
  }

  if (
    normalized === 'prototype' ||
    normalized === 'working-prototype' ||
    normalized === 'experimental'
  ) {
    return 'prototype';
  }

  if (
    normalized === 'completed' ||
    normalized === 'shipped' ||
    normalized === 'live' ||
    normalized === 'production'
  ) {
    return 'completed';
  }

  return undefined;
};

export interface ProjectStatusBadgeProps {
  status: ProjectStatus | string;
  className?: string;
}

/**
 * Accessible, high-contrast, editorial badge representing project status.
 */
export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const normalized = normalizeProjectStatus(status);
  if (!normalized) return null;

  const label = STATUS_DISPLAY_LABELS[normalized];

  // Specific semantic color pairings with guaranteed high contrast against white card background
  const badgeTheme = {
    'in-development': {
      pill: 'bg-amber-50 text-amber-900 border-amber-300/80',
      dot: 'bg-amber-500',
    },
    prototype: {
      pill: 'bg-indigo-50 text-indigo-900 border-indigo-300/80',
      dot: 'bg-indigo-500',
    },
    completed: {
      pill: 'bg-emerald-50 text-emerald-900 border-emerald-300/80',
      dot: 'bg-emerald-600',
    },
  }[normalized];

  return (
    <span
      role="status"
      aria-label={`Project status: ${label}`}
      data-project-status={normalized}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[9px] font-bold tracking-wider uppercase border shadow-2xs pointer-events-none select-none transition-colors ${badgeTheme.pill} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${badgeTheme.dot}`} aria-hidden="true" />
      <span className="truncate">{label}</span>
    </span>
  );
};

export interface WithProjectStatusProps {
  status?: ProjectStatus | string;
  showStatusBadge?: boolean;
}

/**
 * Reusable Higher-Order Component (HOC) that enhances a project card component
 * with a standardized, accessible project status indicator.
 *
 * @param WrappedComponent - The project card component to enhance.
 * @returns An enhanced component preserving all original props and adding status capabilities.
 */
export function withProjectStatus<
  P extends { project: ProjectItem; statusBadge?: React.ReactNode },
>(WrappedComponent: React.ComponentType<P>) {
  const ComponentWithProjectStatus: React.FC<P & WithProjectStatusProps> = ({
    status,
    showStatusBadge = true,
    ...restProps
  }) => {
    const props = restProps as P;
    // Status prop override takes priority; fall back to project metadata status
    const resolvedStatus = status !== undefined ? status : props.project?.status;
    const normalized = normalizeProjectStatus(resolvedStatus);

    const statusBadge =
      showStatusBadge && normalized ? <ProjectStatusBadge status={normalized} /> : null;

    return <WrappedComponent {...props} statusBadge={statusBadge} />;
  };

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ComponentWithProjectStatus.displayName = `withProjectStatus(${displayName})`;

  return ComponentWithProjectStatus;
}

export default withProjectStatus;
