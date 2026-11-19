// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { DynamicIsland } from '../../src/components/layout/DynamicIsland.js';
import { ThemeProvider, useTheme } from '../../src/context/ThemeContext.js';

const TestThemeConsumer: React.FC = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button data-testid="toggle-btn" onClick={toggleTheme}>
        Toggle
      </button>
      <button data-testid="set-dark-btn" onClick={() => setTheme('dark')}>
        Set Dark
      </button>
      <button data-testid="set-light-btn" onClick={() => setTheme('light')}>
        Set Light
      </button>
    </div>
  );
};

describe('Theme Management & Toggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('defaults to light theme when localStorage is empty', () => {
    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('restores dark theme from localStorage on initial load', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles theme between light and dark, updating DOM and localStorage', () => {
    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByTestId('toggle-btn');

    // Light -> Dark
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    // Dark -> Light
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('renders theme toggle button in DynamicIsland and toggles theme on click', () => {
    render(
      <ThemeProvider>
        <DynamicIsland />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('theme-toggle');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-label', 'Switch to dark mode');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Click toggle to switch to dark mode
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(toggleButton).toHaveAttribute('aria-label', 'Switch to light mode');

    // Click toggle again to switch back to light mode
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(toggleButton).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('renders theme toggle in expanded DynamicIsland panel and allows toggling', () => {
    render(
      <ThemeProvider>
        <DynamicIsland />
      </ThemeProvider>
    );

    const island = screen.getByTestId('dynamic-island');
    fireEvent.click(island);

    const expandedToggle = screen.getByTestId('theme-toggle-expanded');
    expect(expandedToggle).toBeInTheDocument();
    expect(expandedToggle).toHaveAttribute('aria-label', 'Switch to dark mode');

    fireEvent.click(expandedToggle);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(expandedToggle).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('useTheme provides a safe fallback when rendered outside ThemeProvider', () => {
    render(<TestThemeConsumer />);

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

    const toggleBtn = screen.getByTestId('toggle-btn');
    fireEvent.click(toggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
