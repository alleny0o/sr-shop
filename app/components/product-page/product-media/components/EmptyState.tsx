import React from 'react';
import { ImageOff } from 'lucide-react';

export const EmptyState = React.memo(() => {
  return (
    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <ImageOff className="w-8 h-8 text-gray-400 mx-auto mb-2" aria-hidden="true" />
        <p className="text-sm text-gray-600">No media available</p>
      </div>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';