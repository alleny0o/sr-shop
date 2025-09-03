import React from 'react';

export const LoadingState = React.memo(() => {
  return (
    <div className="w-full aspect-square bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      <span className="sr-only">Loading product media</span>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';