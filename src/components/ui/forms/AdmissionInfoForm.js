"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  HelpCircle,
  Building,
  Globe,
  GraduationCap,
  MapPin,
  BookOpen,
  CheckCircle,
} from "lucide-react";

const InfoTooltip = ({ content }) => (
  <span title={content} className="inline-flex items-center cursor-help ml-1">
    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
  </span>
);

// Qualification options
const QUALIFICATION_OPTIONS = [
  { value: "intermediate", label: "Intermediate" },
  { value: "alevels", label: "A-Levels" },
  { value: "dae", label: "Diploma of Associate Engineering" },
  { value: "bachelors", label: "Bachelor's" },
  { value: "masters", label: "Master's" },
];

// Admission types
const ADMISSION_TYPES = [
  { value: "regular", label: "Regular Admission" },
  { value: "transfer", label: "Transfer from other University" },
  { value: "special", label: "Special Program" },
  { value: "international", label: "International Student" },
];

// Campuses
const CAMPUSES = [
  {
    value: "north",
    label: "North Campus",
    address: "North Campus, Block 6, Gulshan-e-Iqbal, Karachi",
    programs: ["bs", "bba", "ms", "mba"],
  },
  {
    value: "dha",
    label: "DHA Campus (Phase 8) -Main",
    address: "DHA Phase 8, Karachi",
    programs: ["bs", "bba", "bsaf", "ms", "mba", "phd"],
  },
  {
    value: "bahria",
    label: "Bahria Town Campus",
    address: "Bahria Town, Karachi",
    programs: ["bs", "bba"],
  },
  {
    value: "gulshan",
    label: "Gulshan Campus",
    address: "Gulshan-e-Iqbal, Block 4, Karachi",
    programs: ["bs", "bba", "bsaf"],
  },
];

// Shifts
const SHIFTS = [
  { value: "morning", label: "Morning (8:30 AM - 2:30 PM)" },
  { value: "evening", label: "Evening (3:00 PM - 9:00 PM)" },
  { value: "weekend", label: "Weekend (Saturday-Sunday)" },
];

// Program options
// For brevity, we define a few examples. Add full details as needed.
const PROGRAM_OPTIONS = {
  intermediate: [
    {
      value: "bs",
      label: "Bachelor of Science (BS)",
      duration: "4 Years",
      creditHours: 136,
      majors: [
        { value: "cs", label: "Computer Science", seats: 100 },
        { value: "se", label: "Software Engineering", seats: 80 },
        { value: "ds", label: "Data Science", seats: 60 },
      ],
    },
    {
      value: "bba",
      label: "Bachelor of Business Administration (BBA)",
      duration: "4 Years",
      creditHours: 144,
      majors: [
        { value: "marketing", label: "Marketing", seats: 100 },
        { value: "finance", label: "Finance", seats: 100 },
      ],
    },
  ],
  alevels: [
    {
      value: "bs",
      label: "Bachelor of Science (BS)",
      duration: "4 Years",
      creditHours: 136,
      majors: [
        { value: "cs", label: "Computer Science", seats: 100 },
        { value: "se", label: "Software Engineering", seats: 80 },
      ],
    },
  ],
  bachelors: [
    {
      value: "ms",
      label: "Master of Science (MS)",
      duration: "2 Years",
      creditHours: 30,
      majors: [
        { value: "cs", label: "Computer Science", seats: 40 },
        { value: "se", label: "Software Engineering", seats: 40 },
      ],
    },
    {
      value: "mba",
      label: "Master of Business Administration (MBA)",
      duration: "2 Years",
      creditHours: 36,
      majors: [
        { value: "marketing", label: "Marketing", seats: 50 },
        { value: "finance", label: "Finance", seats: 50 },
      ],
    },
  ],
};

const AvailableSeats = ({ program, major, qualification }) => {
  const programOption = PROGRAM_OPTIONS[qualification]?.find((p) => p.value === program);
  const seats =
    programOption?.majors?.find((m) => m.value === major)?.seats || 0;
  return (
    <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-600">
      <span className="font-medium">Available Seats:</span> {seats}
    </div>
  );
};

const ProgramInfo = ({ program, qualification }) => {
  const programInfo = PROGRAM_OPTIONS[qualification]?.find((p) => p.value === program);
  if (!programInfo) return null;

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-lg space-y-2">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Duration: {programInfo.duration}</span>
        <span>Credit Hours: {programInfo.creditHours}</span>
      </div>
    </div>
  );
};

const AdmissionInfoForm = ({ formData = {}, onChange, onValidation }) => {
  const [errors, setErrors] = useState({
    qualification: "",
    admissionType: "",
    program: "",
    campus: "",
    shift: "",
    major: "",
    previousUniversity: "",
    nationality: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [availableMajors, setAvailableMajors] = useState([]);
  const [availableCampuses, setAvailableCampuses] = useState(CAMPUSES);

  useEffect(() => {
    if (formData.qualification) {
      const programs = PROGRAM_OPTIONS[formData.qualification] || [];
      if (formData.campus) {
        const campus = CAMPUSES.find((c) => c.value === formData.campus);
        const filteredPrograms = programs.filter((p) => campus.programs.includes(p.value));
        setAvailablePrograms(filteredPrograms);
      } else {
        setAvailablePrograms(programs);
      }
    }
  }, [formData.qualification, formData.campus]);

  useEffect(() => {
    if (formData.program && formData.qualification) {
      const program = PROGRAM_OPTIONS[formData.qualification]?.find(
        (p) => p.value === formData.program
      );
      setAvailableMajors(program?.majors || []);
    }
  }, [formData.program, formData.qualification]);

  useEffect(() => {
    if (formData.program) {
      const filteredCampuses = CAMPUSES.filter((campus) => campus.programs.includes(formData.program));
      setAvailableCampuses(filteredCampuses);
    } else {
      setAvailableCampuses(CAMPUSES);
    }
  }, [formData.program]);

  const validateForm = (data) => {
    const newErrors = {
      qualification: "",
      admissionType: "",
      program: "",
      campus: "",
      shift: "",
      major: "",
      previousUniversity: "",
      nationality: "",
    };

    if (!data.qualification) newErrors.qualification = "Current qualification is required";
    if (!data.admissionType) newErrors.admissionType = "Admission type is required";
    if (!data.program) newErrors.program = "Program is required";
    if (!data.campus) newErrors.campus = "Campus is required";
    if (!data.shift) newErrors.shift = "Shift is required";
    if (!data.major) newErrors.major = "Major is required";

    if (data.admissionType === "transfer" && !data.previousUniversity) {
      newErrors.previousUniversity = "Previous university is required for transfer students";
    }

    if (data.admissionType === "international" && !data.nationality) {
      newErrors.nationality = "Nationality is required for international students";
    }

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (typeof onValidation === "function") {
      onValidation(!hasErrors);
    }

    return !hasErrors;
  };

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };

    // Reset dependent fields if qualification or program changes
    if (field === "qualification") {
      newData.program = "";
      newData.major = "";
      newData.campus = "";
    } else if (field === "program") {
      newData.major = "";
      if (!availableCampuses.find((c) => c.value === newData.campus)) {
        newData.campus = "";
      }
    } else if (field === "admissionType") {
      if (value !== "transfer") newData.previousUniversity = "";
      if (value !== "international") newData.nationality = "";
    }

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    onChange(newData);
    validateForm(newData);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!validateForm(formData)) return;

    setIsSubmitting(true);

    const payload = {
      student_id: formData.student_id, // Include student_id to link with the existing record
      current_qualification: formData.qualification,
      admission_type: formData.admissionType,
      program: formData.program,
      major: formData.major,
      campus: formData.campus,
      shift: formData.shift,
    };

    if (formData.admissionType === "transfer") {
      payload.previous_university = formData.previousUniversity;
      payload.previous_program = formData.previousProgram || "";
      payload.completed_semesters = formData.completedSemesters || "";
    }

    if (formData.admissionType === "international") {
      payload.nationality = formData.nationality;
      payload.passportNumber = formData.passportNumber || "";
    }

    try {
      const response = await fetch("http://localhost:3001/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        };
        let responseBody;
        try { responseBody = await response.json(); } catch {
          try { responseBody = await response.text(); } catch { responseBody = "Unable to parse response body."; }
        }
        errorDetails.body = responseBody;

        console.error("Error while submitting the form:", errorDetails);
        throw new Error(`Failed to submit the form: ${JSON.stringify(errorDetails)}`);
      }

      console.log("Admission info saved successfully");
      if (typeof onValidation === "function") {
        onValidation(true);
      }
    } catch (error) {
      console.error("Error:", error);
      if (typeof onValidation === "function") {
        onValidation(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field, label, options, disabled = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={formData[field] || ""}
        onChange={(e) => handleChange(field, e.target.value)}
        disabled={disabled}
        className={`w-full p-3 rounded-lg border ${
          errors[field] ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
        } focus:outline-none focus:ring-2 ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {errors[field] && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors[field]}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Important Notes Alert */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <h3 className="text-base font-semibold text-yellow-800">
            Important Information
          </h3>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-yellow-700">
          <li className="flex items-start gap-2">
            <div className="min-w-4 pt-1">•</div>
            Please ensure all information provided is accurate and complete
          </li>
          <li className="flex items-start gap-2">
            <div className="min-w-4 pt-1">•</div>
            Original documents will be required for verification during admission
          </li>
          <li className="flex items-start gap-2">
            <div className="min-w-4 pt-1">•</div>
            Admission is subject to meeting eligibility criteria and seat availability
          </li>
          <li className="flex items-start gap-2">
            <div className="min-w-4 pt-1">•</div>
            Fee structure may change without prior notice
          </li>
        </ul>
      </div>

      {/* Main Form Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        {/* Form Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-teal-500" />
            Admission Application Form
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Please fill in all required fields marked with *
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={submitForm} className="p-6 space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField("qualification", "Current Qualification *", QUALIFICATION_OPTIONS)}
              {renderField("admissionType", "Admission Type *", ADMISSION_TYPES)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField("program", "Program *", availablePrograms, !formData.qualification)}
              {renderField("major", "Major *", availableMajors, !formData.program)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField("campus", "Campus *", availableCampuses)}
              {renderField("shift", "Shift *", SHIFTS)}
            </div>
          </div>

          {/* Transfer Student Section */}
          {formData.admissionType === "transfer" && (
            <div className="border-t border-gray-100 pt-6 space-y-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <Building className="h-5 w-5 text-teal-500" />
                Previous Institution Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Previous University *
                    <InfoTooltip content="Please provide the name of your previous institution" />
                  </label>
                  <input
                    type="text"
                    value={formData.previousUniversity || ""}
                    onChange={(e) => handleChange("previousUniversity", e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      errors.previousUniversity
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-teal-500"
                    } focus:outline-none focus:ring-2`}
                    placeholder="Enter previous university name"
                  />
                  {errors.previousUniversity && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.previousUniversity}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Previous Program *
                    <InfoTooltip content="Program you were enrolled in at your previous institution" />
                  </label>
                  <input
                    type="text"
                    value={formData.previousProgram || ""}
                    onChange={(e) => handleChange("previousProgram", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-teal-500 focus:outline-none focus:ring-2"
                    placeholder="Enter previous program name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completed Semesters *
                    <InfoTooltip content="Number of semesters completed at previous institution" />
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={formData.completedSemesters || ""}
                    onChange={(e) => handleChange("completedSemesters", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-teal-500 focus:outline-none focus:ring-2"
                    placeholder="Enter number of completed semesters"
                  />
                </div>
              </div>
            </div>
          )}

          {/* International Student Section */}
          {formData.admissionType === "international" && (
            <div className="border-t border-gray-100 pt-6 space-y-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-teal-500" />
                International Student Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality *
                    <InfoTooltip content="Please provide your current nationality" />
                  </label>
                  <input
                    type="text"
                    value={formData.nationality || ""}
                    onChange={(e) => handleChange("nationality", e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      errors.nationality
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-teal-500"
                    } focus:outline-none focus:ring-2`}
                    placeholder="Enter your nationality"
                  />
                  {errors.nationality && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.nationality}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passport Number *
                    <InfoTooltip content="Enter your valid passport number" />
                  </label>
                  <input
                    type="text"
                    value={formData.passportNumber || ""}
                    onChange={(e) => handleChange("passportNumber", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-teal-500 focus:outline-none focus:ring-2"
                    placeholder="Enter passport number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Program Information Section */}
          {formData.program && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal-500" />
                Program Details
              </h3>

              <div className="space-y-4">
                <ProgramInfo
                  program={formData.program}
                  qualification={formData.qualification}
                />

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">Fee Structure</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="block text-gray-600 mb-1">Admission Fee</span>
                      <span className="font-semibold text-gray-800">
                        PKR {formData.admissionType === "international" ? "100,000" : "50,000"}
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="block text-gray-600 mb-1">Security Deposit</span>
                      <span className="font-semibold text-gray-800">
                        PKR {formData.admissionType === "international" ? "50,000" : "25,000"}
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="block text-gray-600 mb-1">Per Semester</span>
                      <span className="font-semibold text-gray-800">
                        PKR {formData.admissionType === "international" ? "250,000" : "150,000"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available Seats */}
          {formData.program && formData.major && (
            <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
              <AvailableSeats
                program={formData.program}
                major={formData.major}
                qualification={formData.qualification}
              />
            </div>
          )}

          {/* Campus Information */}
          {formData.campus && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-500" />
                Campus Information
              </h3>

              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Address</span>
                  <span className="text-gray-600">
                    {CAMPUSES.find((c) => c.value === formData.campus)?.address}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Facilities</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      "Library",
                      "Computer Labs",
                      "Sports Complex",
                      "Cafeteria",
                      "Prayer Area",
                      "Medical Center",
                    ].map((facility) => (
                      <div key={facility} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-teal-500" />
                        {facility}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-6 p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Save Information"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdmissionInfoForm;
