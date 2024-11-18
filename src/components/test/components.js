"use client";

import React from "react";

export const Card = ({ children, className = "", ...props }) => (
  <div className={`rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export const Alert = ({ children, className = "", ...props }) => (
  <div 
    role="alert"
    className={`relative w-full rounded-lg border border-gray-200 p-4 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

export const AlertDescription = ({ children, className = "", ...props }) => (
  <div className={`text-sm ${className}`} {...props}>
    {children}
  </div>
);

export const Progress = ({ value = 0, className = "", ...props }) => (
  <div className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-100 ${className}`} {...props}>
    <div
      className="h-full w-full flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all"
      style={{ transform: `translateX(-${100 - value}%)` }}
    />
  </div>
);