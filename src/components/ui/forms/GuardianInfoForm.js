import React, { useState, useEffect } from "react";
import { User2, AlertCircle, Info } from "lucide-react";

const RELATIONSHIPS = [
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Uncle",
  "Aunt",
  "Guardian",
  "Other",
];

const EDUCATION_LEVELS = [
  "Primary",
  "Secondary",
  "Intermediate",
  "Bachelor's",
  "Master's",
  "M.Phil",
  "PhD",
  "Other",
];

const GuardianInfoForm = ({ formData = {}, onChange, onValidation }) => {
  const [errors, setErrors] = useState({});

  // Styling constants
  const sectionClass =
    "bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = (error) => `
    w-full p-3 border rounded-lg transition-all duration-200
    ${
      error
        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-400"
        : "border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
    }
    hover:border-teal-300
  `;

  // Form Field Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    onChange(updatedData);
    validateField(name, value, updatedData);
  };

  const validateField = (name, value, updatedData) => {
    let fieldErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value?.trim()) {
          fieldErrors.name = "Guardian name is required";
        } else if (!/^[\p{L}\s'-]+$/u.test(value.trim())) {
          fieldErrors.name = "Name contains invalid characters";
        } else {
          delete fieldErrors.name;
        }
        break;

      case "relationship":
        if (!value) {
          fieldErrors.relationship = "Relationship is required";
        } else {
          delete fieldErrors.relationship;
        }
        break;

      case "contactNo":
        if (!value) {
          fieldErrors.contactNo = "Contact number is required";
        } else if (!/^03\d{9}$/.test(value)) {
          fieldErrors.contactNo =
            "Please enter a valid Pakistani mobile number (03XXXXXXXXX)";
        } else {
          delete fieldErrors.contactNo;
        }
        break;

      case "cnic":
        if (!value) {
          fieldErrors.cnic = "CNIC is required";
        } else if (!/^\d{5}-\d{7}-\d{1}$/.test(value)) {
          fieldErrors.cnic =
            "Please enter a valid CNIC number (format: XXXXX-XXXXXXX-X)";
        } else {
          delete fieldErrors.cnic;
        }
        break;

      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          fieldErrors.email = "Please enter a valid email address";
        } else {
          delete fieldErrors.email;
        }
        break;

      default:
        break;
    }

    setErrors(fieldErrors);
    return !Object.values(fieldErrors).some((error) => error);
  };

  // Format CNIC input
  const formatCNIC = (value) => {
    const numbers = value.replace(/[^\d]/g, "");
    if (numbers.length <= 5) return numbers;
    if (numbers.length <= 12)
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 12)}-${numbers.slice(
      12,
      13
    )}`;
  };

  const handleCNICChange = (e) => {
    const formatted = formatCNIC(e.target.value);
    handleChange({ target: { name: "cnic", value: formatted } });
  };

  // Format contact number
  const handleContactChange = (e) => {
    const numbers = e.target.value.replace(/[^\d]/g, "").slice(0, 11);
    handleChange({ target: { name: "contactNo", value: numbers } });
  };

  // Validation Effect
  useEffect(() => {
    const requiredFields = ["name", "relationship", "contactNo", "cnic"];

    const isValid =
      !Object.values(errors).some((error) => error) &&
      requiredFields.every((field) => formData[field]);

    onValidation?.(isValid);
  }, [errors, formData, onValidation]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Form Guidelines */}
      <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-100">
        <h4 className="font-medium text-amber-800 mb-2 flex items-center">
          <Info className="w-5 h-5 mr-2" />
          Important Information
        </h4>
        <ul className="list-disc list-inside space-y-2 text-sm text-amber-700">
          <li>
            All fields marked with <span className="text-red-500">*</span> are
            mandatory
          </li>
          <li>
            Contact number must be a valid Pakistani mobile number (03XXXXXXXXX)
          </li>
          <li>CNIC must follow the format: XXXXX-XXXXXXX-X</li>
          <li>Optional fields can be left blank if not applicable</li>
          <li>
            Email address will be used for important communications if provided
          </li>
          <li>
            Please ensure all provided information is accurate and up-to-date
          </li>
        </ul>
      </div>

      <div className={sectionClass}>
        <div className="flex items-center mb-6">
          <User2 className="w-6 h-6 text-teal-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Guardian Information
          </h2>
        </div>

        {/* Required Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className={labelClass}>
              Guardian Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className={inputClass(errors.name)}
              placeholder="Enter guardian's full name"
              required
            />
            {errors.name && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.name}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="relationship" className={labelClass}>
              Relationship <span className="text-red-500">*</span>
            </label>
            <select
              id="relationship"
              name="relationship"
              value={formData.relationship || ""}
              onChange={handleChange}
              className={inputClass(errors.relationship)}
              required
            >
              <option value="">Select Relationship</option>
              {RELATIONSHIPS.map((relation) => (
                <option key={relation} value={relation}>
                  {relation}
                </option>
              ))}
            </select>
            {errors.relationship && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.relationship}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="contactNo" className={labelClass}>
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              id="contactNo"
              type="text"
              name="contactNo"
              value={formData.contactNo || ""}
              onChange={handleContactChange}
              className={inputClass(errors.contactNo)}
              placeholder="03XXXXXXXXX"
              maxLength={11}
              required
            />
            {errors.contactNo && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.contactNo}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="cnic" className={labelClass}>
              CNIC Number <span className="text-red-500">*</span>
            </label>
            <input
              id="cnic"
              type="text"
              name="cnic"
              value={formData.cnic || ""}
              onChange={handleCNICChange}
              className={inputClass(errors.cnic)}
              placeholder="XXXXX-XXXXXXX-X"
              maxLength={15}
              required
            />
            {errors.cnic && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.cnic}</span>
              </div>
            )}
          </div>
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <label htmlFor="education" className={labelClass}>
              Education
            </label>
            <select
              id="education"
              name="education"
              value={formData.education || ""}
              onChange={handleChange}
              className={inputClass(errors.education)}
            >
              <option value="">Select Education Level</option>
              {EDUCATION_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="occupation" className={labelClass}>
              Occupation
            </label>
            <input
              id="occupation"
              type="text"
              name="occupation"
              value={formData.occupation || ""}
              onChange={handleChange}
              className={inputClass(errors.occupation)}
              placeholder="Enter occupation"
            />
          </div>

          <div>
            <label htmlFor="organization" className={labelClass}>
              Organization
            </label>
            <input
              id="organization"
              type="text"
              name="organization"
              value={formData.organization || ""}
              onChange={handleChange}
              className={inputClass(errors.organization)}
              placeholder="Enter organization name"
            />
          </div>

          <div>
            <label htmlFor="designation" className={labelClass}>
              Designation
            </label>
            <input
              id="designation"
              type="text"
              name="designation"
              value={formData.designation || ""}
              onChange={handleChange}
              className={inputClass(errors.designation)}
              placeholder="Enter designation"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="email" className={labelClass}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className={inputClass(errors.email)}
              placeholder="Enter email address"
            />
            {errors.email && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardianInfoForm;
