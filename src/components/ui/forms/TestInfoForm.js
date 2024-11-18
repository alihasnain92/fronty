'use client';
import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TestInfoForm = () => {
  const router = useRouter();
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleAcknowledgment = () => {
    setIsAcknowledged(true);
    setShowError(false);
  };

  const handleStartTest = () => {
    if (!isAcknowledged) {
      setShowError(true);
    } else {
      router.push('/test/exam');
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-6">
          {/* Icon and Title */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Test Guidelines
            </h3>
          </div>

          {/* Test Guidelines */}
          <div className="text-base text-gray-600 space-y-4">
            <p>To ensure the best experience, please read the following test guidelines carefully:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Make sure you are in a quiet environment with a stable internet connection.</li>
              <li>Once the test begins, avoid refreshing the page or navigating away, as this may invalidate your attempt.</li>
              <li>Read each question carefully before submitting your answers.</li>
              <li>You will have a limited amount of time to complete the test, so manage your time wisely.</li>
              <li>If you encounter any issues, please contact support immediately.</li>
            </ul>
          </div>

          {/* Important Note */}
          <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
            <p className="font-semibold mb-2">Important Note:</p>
            <p>By starting the test, you agree to follow the guidelines provided and understand the consequences of violating them.</p>
          </div>

          {/* Action Button */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <button
                onClick={handleAcknowledgment}
                disabled={isAcknowledged}
                className={`px-8 py-3 font-medium rounded-lg text-base min-w-[200px]
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${isAcknowledged 
                    ? 'bg-green-100 text-green-800 cursor-default'
                    : 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500'
                  }`}
              >
                {isAcknowledged ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Acknowledged
                  </span>
                ) : (
                  "OK, I Understand"
                )}
              </button>
            </div>

            {/* Start Test Button */}
            <div className="flex justify-center">
              <button
                onClick={handleStartTest}
                className="px-8 py-3 font-medium rounded-lg text-base min-w-[200px] bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Start Test
              </button>
            </div>

            {/* Error Message */}
            {showError && !isAcknowledged && (
              <div className="flex items-center justify-center text-red-500 text-sm mt-2">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>Please acknowledge the guidelines before starting the test</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInfoForm;