// src/app/enroll/loading.js
export default function Loading() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Enrollment Form...</h2>
          <p className="text-gray-500 mt-2">Please wait while we prepare your application.</p>
        </div>
      </div>
    );
  }