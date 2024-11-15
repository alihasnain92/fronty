// src/components/ui/FormProgress.js
import React from 'react';
import { Check } from 'lucide-react';

const FormProgress = ({ steps, currentStep, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-4">
        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep;
          const isCurrent = index + 1 === currentStep;
          
          return (
            <div 
              key={step.id} 
              className="flex flex-col items-center flex-1"
            >
              <div className="relative flex items-center justify-center w-full">
                <div
                  className={`h-1 flex-1 ${
                    index === 0 ? 'hidden' : ''
                  } ${
                    index < currentStep - 1
                      ? 'bg-teal-500'
                      : 'bg-gray-200'
                  }`}
                />
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    isCompleted
                      ? 'bg-teal-500 border-teal-500 text-white'
                      : isCurrent
                      ? 'border-teal-500 text-teal-500'
                      : 'border-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm">{step.id}</span>
                  )}
                </div>
                <div
                  className={`h-1 flex-1 ${
                    index === steps.length - 1 ? 'hidden' : ''
                  } ${
                    index < currentStep - 1
                      ? 'bg-teal-500'
                      : 'bg-gray-200'
                  }`}
                />
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCurrent ? 'text-teal-500' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormProgress;