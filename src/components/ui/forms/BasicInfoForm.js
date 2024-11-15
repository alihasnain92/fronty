import React, { useState, useEffect } from "react";
import { User, AlertCircle, Info } from "lucide-react";

const NATIONALITY_OPTIONS = ["Pakistani", "Dual National"];

const RELIGION_OPTIONS = [
  "Islam",
  "Christianity",
  "Hinduism",
  "Sikhism",
  "Buddhism",
  "Judaism",
  "Other",
];

const PROVINCE_OPTIONS = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Kashmir",
  "Islamabad Capital Territory",
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const DISABILITY_OPTIONS = ["None", "Physical", "Visual", "Hearing", "Other"];

const BasicInfoForm = ({ formData = {}, onChange, onValidation }) => {
  const [errors, setErrors] = useState({});
  const [showDualNationalityFields, setShowDualNationalityFields] = useState(
    formData.nationality === "Dual National"
  );
  const [showDisabilityDetails, setShowDisabilityDetails] = useState(
    formData.disability && formData.disability !== "None"
  );

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
    let updatedData = { ...formData, [name]: value };

    // Handle nationality change
    if (name === "nationality") {
      setShowDualNationalityFields(value === "Dual National");
      if (value !== "Dual National") {
        delete updatedData.secondNationality;
        delete updatedData.passportNumber;
      }
    }

    // Handle disability change
    if (name === "disability") {
      const shouldShowDetails = value !== "None";
      setShowDisabilityDetails(shouldShowDetails);
      if (!shouldShowDetails) {
        delete updatedData.disabilityDetails;
      }
      // Validate disabilityDetails when disability changes
      validateField(
        "disabilityDetails",
        updatedData.disabilityDetails,
        updatedData
      );
    }

    onChange(updatedData);
    validateField(name, value, updatedData);
  };

  const validateField = (name, value, updatedFormData) => {
    let fieldErrors = { ...errors };

    switch (name) {
      case "fatherName":
        if (!value?.trim()) {
          fieldErrors.fatherName = "Father's name is required";
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          fieldErrors.fatherName = "Father's name should only contain letters";
        } else {
          delete fieldErrors.fatherName;
        }
        break;

      case "gender":
        if (!value) {
          fieldErrors.gender = "Gender is required";
        } else {
          delete fieldErrors.gender;
        }
        break;

      case "dateOfBirth":
        if (!value) {
          fieldErrors.dateOfBirth = "Date of birth is required";
        } else {
          const dob = new Date(value);
          const now = new Date();
          const age = now.getFullYear() - dob.getFullYear();
          const monthDiff = now.getMonth() - dob.getMonth();
          const actualAge =
            monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())
              ? age - 1
              : age;

          if (actualAge < 15) {
            fieldErrors.dateOfBirth = "You must be at least 15 years old";
          } else if (actualAge > 60) {
            fieldErrors.dateOfBirth = "Please verify the date of birth";
          } else {
            delete fieldErrors.dateOfBirth;
          }
        }
        break;

      case "nationality":
        if (!value) {
          fieldErrors.nationality = "Nationality is required";
        } else {
          delete fieldErrors.nationality;
        }
        break;

      case "religion":
        if (!value) {
          fieldErrors.religion = "Religion is required";
        } else {
          delete fieldErrors.religion;
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

      case "province":
        if (!value) {
          fieldErrors.province = "Province is required";
        } else {
          delete fieldErrors.province;
        }
        break;

      case "secondNationality":
        if (showDualNationalityFields) {
          if (!value?.trim()) {
            fieldErrors.secondNationality =
              "Second nationality is required for dual nationals";
          } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
            fieldErrors.secondNationality = "Please enter a valid nationality";
          } else {
            delete fieldErrors.secondNationality;
          }
        } else {
          delete fieldErrors.secondNationality;
        }
        break;

      case "passportNumber":
        if (showDualNationalityFields) {
          if (!value) {
            fieldErrors.passportNumber =
              "Passport number is required for dual nationals";
          } else if (value.length < 6) {
            fieldErrors.passportNumber =
              "Passport number should be at least 6 characters";
          } else {
            delete fieldErrors.passportNumber;
          }
        } else {
          delete fieldErrors.passportNumber;
        }
        break;

      case "disability":
        if (value === "None") {
          delete fieldErrors.disabilityDetails;
        }
        break;

      case "disabilityDetails":
        if (
          updatedFormData.disability &&
          updatedFormData.disability !== "None"
        ) {
          if (!value?.trim()) {
            fieldErrors.disabilityDetails = "Please provide disability details";
          } else {
            delete fieldErrors.disabilityDetails;
          }
        } else {
          delete fieldErrors.disabilityDetails;
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

  // Validation Effect
  useEffect(() => {
    const requiredFields = [
      "fatherName",
      "gender",
      "dateOfBirth",
      "nationality",
      "religion",
      "cnic",
      "province",
    ];

    if (showDualNationalityFields) {
      requiredFields.push("secondNationality", "passportNumber");
    }

    // Check if all required fields are filled
    const requiredFieldsFilled = requiredFields.every(
      (field) => formData[field]
    );

    // Check for errors
    const hasNoErrors = Object.values(errors).every((error) => !error);

    // Special handling for disability
    const isDisabilityValid =
      !formData.disability || // If no disability selected yet
      formData.disability === "None" || // If None selected
      (formData.disability !== "None" && formData.disabilityDetails); // If disability selected and details provided

    const isValid = requiredFieldsFilled && hasNoErrors && isDisabilityValid;
    onValidation?.(isValid);
  }, [
    errors,
    formData,
    showDualNationalityFields,
    showDisabilityDetails,
    onValidation,
  ]);

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
          <li>Ensure your CNIC number follows the format: XXXXX-XXXXXXX-X</li>
          <li>Date of birth should show that you are at least 15 years old</li>
          <li>Province should match your domicile certificate and CNIC</li>
          <li>
            If you have a disability, providing accurate details will help us
            accommodate your needs
          </li>
        </ul>
      </div>

      <div className={sectionClass}>
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 text-teal-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Basic Information
          </h2>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fatherName" className={labelClass}>
              Father's Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fatherName"
              type="text"
              name="fatherName"
              value={formData.fatherName || ""}
              onChange={handleChange}
              className={inputClass(errors.fatherName)}
              placeholder="Enter your father's name"
              required
            />
            {errors.fatherName && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.fatherName}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="gender" className={labelClass}>
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className={inputClass(errors.gender)}
              required
            >
              <option value="">Select Gender</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.gender && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.gender}</span>
              </div>
            )}
          </div>
        </div>

        {/* Date of Birth and Nationality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label htmlFor="dateOfBirth" className={labelClass}>
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth || ""}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className={inputClass(errors.dateOfBirth)}
              required
            />
            {errors.dateOfBirth && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.dateOfBirth}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="nationality" className={labelClass}>
              Nationality <span className="text-red-500">*</span>
            </label>
            <select
              id="nationality"
              name="nationality"
              value={formData.nationality || ""}
              onChange={handleChange}
              className={inputClass(errors.nationality)}
              required
            >
              <option value="">Select Nationality</option>
              {NATIONALITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.nationality && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.nationality}</span>
              </div>
            )}
          </div>
        </div>

        {/* Religion and CNIC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label htmlFor="religion" className={labelClass}>
              Religion <span className="text-red-500">*</span>
            </label>
            <select
              id="religion"
              name="religion"
              value={formData.religion || ""}
              onChange={handleChange}
              className={inputClass(errors.religion)}
              required
            >
              <option value="">Select Religion</option>
              {RELIGION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.religion && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.religion}</span>
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
              maxLength={15}
              className={inputClass(errors.cnic)}
              placeholder="XXXXX-XXXXXXX-X"
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

        {/* Province and Disability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label htmlFor="province" className={labelClass}>
              Province <span className="text-red-500">*</span>
            </label>
            <select
              id="province"
              name="province"
              value={formData.province || ""}
              onChange={handleChange}
              className={inputClass(errors.province)}
              required
            >
              <option value="">Select Province</option>
              {PROVINCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.province && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.province}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="disability" className={labelClass}>
              Disability
            </label>
            <select
              id="disability"
              name="disability"
              value={formData.disability || "None"}
              onChange={handleChange}
              className={inputClass(errors.disability)}
            >
              {DISABILITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Disability Details */}
        {showDisabilityDetails && formData.disability !== "None" && (
          <div className="mt-6">
            <label htmlFor="disabilityDetails" className={labelClass}>
              Disability Details <span className="text-red-500">*</span>
            </label>
            <textarea
              id="disabilityDetails"
              name="disabilityDetails"
              value={formData.disabilityDetails || ""}
              onChange={handleChange}
              className={`${inputClass(
                errors.disabilityDetails
              )} min-h-[120px]`}
              placeholder="Please provide details about your disability to help us better accommodate your needs"
              required={showDisabilityDetails}
            />
            {errors.disabilityDetails && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.disabilityDetails}</span>
              </div>
            )}
            <div className="mt-2 text-sm text-gray-500 flex items-center">
              <Info className="w-4 h-4 mr-1" />
              <span>
                This information will be used to provide appropriate
                accommodations
              </span>
            </div>
          </div>
        )}

        {/* Dual Nationality Fields */}
        {showDualNationalityFields && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-4">
              Dual Nationality Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="secondNationality" className={labelClass}>
                  Second Nationality <span className="text-red-500">*</span>
                </label>
                <input
                  id="secondNationality"
                  type="text"
                  name="secondNationality"
                  value={formData.secondNationality || ""}
                  onChange={handleChange}
                  className={inputClass(errors.secondNationality)}
                  placeholder="Enter your second nationality"
                  required={showDualNationalityFields}
                />
                {errors.secondNationality && (
                  <div className="flex items-center mt-1 text-red-500">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errors.secondNationality}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="passportNumber" className={labelClass}>
                  Passport Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="passportNumber"
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber || ""}
                  onChange={handleChange}
                  className={inputClass(errors.passportNumber)}
                  placeholder="Enter your passport number"
                  required={showDualNationalityFields}
                />
                {errors.passportNumber && (
                  <div className="flex items-center mt-1 text-red-500">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errors.passportNumber}</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Important Notice for Dual Nationals
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-sm text-blue-700">
                    <li>
                      Please ensure your passport is valid for at least 6 months
                    </li>
                    <li>
                      Original passport must be presented during document
                      verification
                    </li>
                    <li>
                      Provide a copy of your foreign national ID card (if
                      applicable)
                    </li>
                    <li>
                      Additional documentation may be required during admission
                      process
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoForm;
