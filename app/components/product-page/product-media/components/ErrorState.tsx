import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
}

export const ErrorState = React.memo<ErrorStateProps>(({ error }) => {
  return (
    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-8 h-8 text-pastel-green-dark mx-auto mb-2" aria-hidden="true" />
        <p className="text-sm text-gray-600">Failed to load media</p>
        <p className="text-xs text-gray-500 mt-1">{error}</p>
      </div>
    </div>
  );
});

ErrorState.displayName = 'ErrorState';