"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ArrowRight,
  Search,
  X,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StudentInfoForm from "@/components/ui/forms/StudentInfoForm";
import AdmissionInfoForm from "@/components/ui/forms/AdmissionInfoForm";
import BasicInfoForm from "@/components/ui/forms/BasicInfoForm";
import ResidenceInfoForm from "@/components/ui/forms/ResidenceInfoForm";
import GuardianInfoForm from "@/components/ui/forms/GuardianInfoForm";
import AcademicInfoForm from "@/components/ui/forms/AcademicInfoForm";
import DocumentInfoForm from "@/components/ui/forms/DocumentInfoForm";
import AgreementForm from "@/components/ui/forms/AgreementInfoForm";
import ProcessingInfoForm from "@/components/ui/forms/ProcessingInfoForm";
import TestInfoForm from "@/components/ui/forms/TestInfoForm";
import { submitEnrollment, fetchAdmissionStatus } from "@/lib/api";

const steps = [
  { id: 1, title: "Student Info", component: TestInfoForm   },
  { id: 2, title: "Admission Info", component: AdmissionInfoForm },
  { id: 3, title: "Basic Info", component: BasicInfoForm },
  { id: 4, title: "Residence Info", component: ResidenceInfoForm },
  { id: 5, title: "Guardian's Info", component: GuardianInfoForm },
  { id: 6, title: "Academic's Info", component: AcademicInfoForm },
  { id: 7, title: "Documents", component: DocumentInfoForm },
  { id: 8, title: "Agreement", component: AgreementForm },
  { id: 9, title: "Application Processing", component: ProcessingInfoForm },
  { id: 10, title: "Entry Test", component: null },
];

const ProgressSidebar = ({ currentStep, admissionCode }) => (
  <div className="w-80 bg-white shadow-lg">
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Admission Progress
      </h2>
      {admissionCode && (
        <div className="mb-4 p-3 bg-teal-50 rounded-lg border border-teal-100">
          <p className="text-sm text-teal-800">Admission Code:</p>
          <p className="font-mono font-medium">{admissionCode}</p>
        </div>
      )}
      <div className="space-y-1">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
              currentStep === step.id
                ? "bg-teal-50 border-l-4 border-teal-500"
                : index < currentStep - 1
                ? "text-gray-600 bg-gray-50"
                : "text-gray-400"
            }`}
          >
            <div className="relative flex items-center justify-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${
                  index < currentStep - 1
                    ? "bg-teal-500 border-teal-500"
                    : currentStep === step.id
                    ? "border-teal-500 text-teal-500"
                    : "border-gray-300 text-gray-300"
                }`}
              >
                {index < currentStep - 1 ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-sm">{step.id}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`absolute h-full w-0.5 top-8 left-1/2 transform -translate-x-1/2 
                  ${index < currentStep - 1 ? "bg-teal-500" : "bg-gray-200"}`}
                />
              )}
            </div>
            <span className="ml-3 font-medium">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AdmissionSearch = ({ onSearch, isSearching }) => {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      onSearch(code.trim());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Continue Existing Application
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your admission code to continue"
            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 disabled:bg-gray-300"
        >
          {isSearching ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          Search
        </button>
      </form>
    </div>
  );
};

const WelcomeScreen = ({ onStartNew, onSearch, isSearching }) => (
  <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
    <div className="max-w-2xl w-full space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to Student Admission
        </h1>
        <p className="text-gray-600">
          Start a new application or continue an existing one
        </p>
      </div>

      <AdmissionSearch onSearch={onSearch} isSearching={isSearching} />

      <div className="text-center">
        <span className="text-gray-500">or</span>
      </div>

      <button
        onClick={onStartNew}
        className="w-full p-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2"
      >
        <ArrowRight className="w-5 h-5" />
        Start New Application
      </button>
    </div>
  </div>
);

export default function EnrollmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stepValidation, setStepValidation] = useState({});
  const [admissionCode, setAdmissionCode] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showNewApplication, setShowNewApplication] = useState(true);

  const handleFormChange = useCallback((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const handleStepValidation = useCallback(
    (isValid) => {
      setStepValidation((prev) => ({
        ...prev,
        [currentStep]: isValid,
      }));
    },
    [currentStep]
  );

  const handleAdmissionSearch = async (code) => {
    setIsSearching(true);
    setError(null);

    try {
      const response = await fetchAdmissionStatus(code);

      if (response.status === "incomplete") {
        setFormData(response.formData);
        setCurrentStep(response.lastCompletedStep + 1);
        setAdmissionCode(code);
        setShowNewApplication(false);

        // Set validation for completed steps
        const validationState = {};
        for (let i = 1; i <= response.lastCompletedStep; i++) {
          validationState[i] = true;
        }
        setStepValidation(validationState);
      } else if (response.status === "complete") {
        setError(
          "This application is already complete. Please start a new application if needed."
        );
      }
    } catch (err) {
      setError(
        "Invalid admission code or no application found with this code."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const goToNextStep = useCallback(async () => {
    if (currentStep < steps.length && stepValidation[currentStep]) {
      setIsLoading(true);
      try {
        // Save progress
        if (admissionCode) {
          await submitEnrollment({
            admissionCode,
            formData,
            currentStep,
            status: currentStep === steps.length ? "complete" : "incomplete",
          });
        }
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      } catch (err) {
        setError("Failed to save progress. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentStep, stepValidation, formData, admissionCode]);

  const startNewApplication = () => {
    setFormData({});
    setCurrentStep(1);
    setStepValidation({});
    setAdmissionCode(null);
    setShowNewApplication(false);
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  if (showNewApplication) {
    return (
      <WelcomeScreen
        onStartNew={startNewApplication}
        onSearch={handleAdmissionSearch}
        isSearching={isSearching}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex">
      {/* Sidebar Progress */}
      <ProgressSidebar
        currentStep={currentStep}
        admissionCode={admissionCode}
      />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Form Content */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              {steps[currentStep - 1].title}
            </h1>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              CurrentStepComponent && (
                <CurrentStepComponent
                  formData={formData}
                  onChange={handleFormChange}
                  onValidation={handleStepValidation}
                />
              )
            )}
            {error && (
              <div className="text-red-500 mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => currentStep > 1 ? setCurrentStep((prev) => prev - 1) : setShowNewApplication(true)}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                "bg-teal-600 hover:bg-teal-700 text-white"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              {currentStep > 1 ? "Previous Step" : "Back to Start"}
            </button>
            <button
              onClick={goToNextStep}
              disabled={isLoading || !stepValidation[currentStep]}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                stepValidation[currentStep]
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {currentStep === steps.length ? "Complete" : "Next Step"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
