// src/components/ui/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
  </div>
);

export default LoadingSpinner;