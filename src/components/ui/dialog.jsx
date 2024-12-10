// src/components/ui/dialog.jsx

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils'; // Ensure this utility function is correctly implemented.

// Main Dialog Component
export const Dialog = DialogPrimitive.Root;

// Dialog Content Component
export const DialogContent = React.forwardRef(({ children, className, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className={cn("fixed inset-0 z-50 bg-black/40 backdrop-blur-sm", className)}>
      <DialogPrimitive.Content
        {...props}
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-md p-6 bg-white rounded-lg shadow-lg",
          className
        )}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Overlay>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = 'DialogContent';

// Dialog Header Component
export const DialogHeader = ({ className, children, ...props }) => (
  <div className={cn("p-4 border-b border-gray-200", className)} {...props}>
    {children}
  </div>
);
DialogHeader.displayName = 'DialogHeader';

// Dialog Title Component
export const DialogTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Title {...props} ref={ref} className={cn("text-lg font-semibold", className)}>
    {children}
  </DialogPrimitive.Title>
));
DialogTitle.displayName = 'DialogTitle';

// Dialog Description Component
export const DialogDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Description {...props} ref={ref} className={cn("text-sm", className)}>
    {children}
  </DialogPrimitive.Description>
));
DialogDescription.displayName = 'DialogDescription';

