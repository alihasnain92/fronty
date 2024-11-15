import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ProcessingInfoForm = ({ onValidation }) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleAcknowledgment = () => {
    setIsAcknowledged(true);
    setShowError(false);
    onValidation?.(true);
  };

  const handleNext = () => {
    if (!isAcknowledged) {
      setShowError(true);
    } else {
      onValidation?.(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-6">
          {/* Success Icon and Title */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Application Submitted Successfully
            </h3>
          </div>

          {/* Processing Time */}
          <div className="flex items-center justify-center text-amber-600 bg-amber-50 rounded-lg p-4">
            <Clock className="h-6 w-6 mr-2" />
            <span className="text-base font-medium">Processing Time: 24 Hours</span>
          </div>

          {/* Information */}
          <div className="text-base text-gray-600 space-y-4">
            <p>
              Thank you for submitting your application. Our team will verify your documents 
              within the next 24 hours.
            </p>
            <p>
              You will receive a notification regarding the status of your documents. Please ensure 
              your contact information is up to date.
            </p>
            <p>
              If any issues are found with your documents, you will be notified to make the 
              necessary corrections.
            </p>
          </div>

          {/* Important Note */}
          <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
            <p className="font-semibold mb-2">Important Note:</p>
            <p>Please check your email regularly for updates about your application status.</p>
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

            {/* Error Message */}
            {showError && !isAcknowledged && (
              <div className="flex items-center justify-center text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>Please acknowledge the information before proceeding</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingInfoForm;