/**
 * FILE: NotFoundPage.tsx
 * PURPOSE: 404 fallback page for unrecognized routes.
 * WHY: Provides a graceful error state rather than a blank screen.
 */

import { useLocation } from "wouter";

export function NotFoundPage() {
  const [, setLocation] = useLocation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <p className="text-gray-500 text-lg mb-6">This page doesn&apos;t exist.</p>
      <button
        onClick={() => setLocation("/")}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Go Home
      </button>
    </div>
  );
}
