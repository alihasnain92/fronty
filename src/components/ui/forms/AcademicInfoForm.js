import React, { useState, useEffect } from 'react';
import { GraduationCap, School, AlertCircle, Info } from 'lucide-react';

const MATRIC_EDUCATION_SYSTEMS = [
  "Matriculation",
  "O-Level",
  "Other"
];

const INTER_EDUCATION_SYSTEMS = [
  "Intermediate",
  "A-Level",
  "Other"
];

const BOARDS = [
  "Karachi Board",
  "Federal Board",
  "Hyderabad Board",
  "Cambridge",
  "Edexcel",
  "Other"
];

const GROUPS = [
  "Science (Pre-Medical)",
  "Science (Pre-Engineering)",
  "Science (Computer Science)",
  "Arts",
  "Commerce",
  "General"
];

const RESULT_STATUS_MATRIC = ["Passed"];
const RESULT_STATUS_INTER = ["Awaited", "Passed", "Supplementary"];
const YEARS = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);

const AcademicInfoForm = ({ formData = {}, onChange, onValidation }) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Handle changes in Result Status
    if (name.endsWith("ResultStatus")) {
      const level = name.startsWith("matric") ? "matric" : "inter";

      if (level === "inter") {
        if (value !== "Passed") {
          updatedData[`${level}ObtainedMarks`] = "";
          setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[`${level}ObtainedMarks`];
            return newErrors;
          });
        }
      }
    }

    onChange(updatedData);
    validateField(name, value, updatedData);
  };

  const validateField = (name, value, updatedData) => {
    let fieldErrors = { ...errors };

    const level = name.startsWith("matric") ? "matric" : name.startsWith("inter") ? "inter" : null;
    if (!level) return true;

    switch (name) {
      case `${level}System`:
      case `${level}Board`:
      case `${level}Year`:
      case `${level}Group`:
      case `${level}Institute`:
      case `${level}ResultStatus`:
        fieldErrors[name] = !value
          ? `${name
              .replace(`${level}`, "")
              .replace(/([A-Z])/g, " $1")
              .trim()} is required`
          : "";
        if (fieldErrors[name] === "") {
          delete fieldErrors[name];
        }
        break;

      case `${level}RollNo`:
        if (
          level === "matric" ||
          ["Passed", "Awaited", "Supplementary"].includes(
            updatedData[`${level}ResultStatus`]
          )
        ) {
          if (!value) {
            fieldErrors[name] = "Roll number is required";
          } else if (!/^[A-Za-z0-9-]+$/.test(value)) {
            fieldErrors[name] = "Invalid roll number format";
          } else {
            delete fieldErrors[name];
          }
        } else {
          delete fieldErrors[name];
        }
        break;

      case `${level}ObtainedMarks`:
        if (
          level === "matric" ||
          updatedData[`${level}ResultStatus`] === "Passed"
        ) {
          if (!value) {
            fieldErrors[name] = "Obtained marks are required";
          } else if (value < 0) {
            fieldErrors[name] = "Obtained marks cannot be negative";
          } else if (value > 1100) {
            fieldErrors[name] = "Obtained marks cannot exceed 1100";
          } else {
            delete fieldErrors[name];
          }
        } else {
          delete fieldErrors[name];
        }
        break;

      case "interYear":
        // Ensure Intermediate year is at least two years after Matric year
        if (
          updatedData["matricYear"] &&
          value &&
          parseInt(value) < parseInt(updatedData["matricYear"]) + 2
        ) {
          fieldErrors[name] =
            "Intermediate passing year must be at least two years after Matric passing year";
        } else {
          delete fieldErrors[name];
        }
        break;

      default:
        break;
    }

    setErrors(fieldErrors);
    return !Object.values(fieldErrors).some((error) => error);
  };

  // Validation Effect
  useEffect(() => {
    const requiredFields = [
      "matricSystem",
      "matricBoard",
      "matricYear",
      "matricGroup",
      "matricInstitute",
      "matricRollNo",
      "matricObtainedMarks",
      "interSystem",
      "interBoard",
      "interYear",
      "interGroup",
      "interInstitute",
      "interResultStatus",
      ...(formData.interResultStatus &&
      ["Passed", "Awaited", "Supplementary"].includes(
        formData.interResultStatus
      )
        ? ["interRollNo"]
        : []),
      ...(formData.interResultStatus === "Passed"
        ? ["interObtainedMarks"]
        : []),
    ];

    const isValid =
      !Object.values(errors).some((error) => error) &&
      requiredFields.every((field) => formData[field]);

    onValidation?.(isValid);
  }, [errors, formData, onValidation]);

  const submitForm = async (e) => {
    e.preventDefault();
  
    // Validate all required fields again before submission
    const requiredFields = [
      "matricSystem",
      "matricBoard",
      "matricYear",
      "matricGroup",
      "matricInstitute",
      "matricRollNo",
      "matricObtainedMarks",
      "interSystem",
      "interBoard",
      "interYear",
      "interGroup",
      "interInstitute",
      "interResultStatus",
      ...(formData.interResultStatus &&
      ["Passed", "Awaited", "Supplementary"].includes(
        formData.interResultStatus
      )
        ? ["interRollNo"]
        : []),
      ...(formData.interResultStatus === "Passed"
        ? ["interObtainedMarks"]
        : []),
    ];
  
    let isValid = true;
    requiredFields.forEach((field) => {
      isValid = validateField(field, formData[field], formData) && isValid;
    });
  
    if (!isValid) return;
  
    setIsSubmitting(true);
  
    const matricPayload = {
      student_id: formData.student_id,
      education_system: formData.matricSystem,
      board_university: formData.matricBoard,
      institute: formData.matricInstitute,
      passing_year: parseInt(formData.matricYear, 10), // Convert passing year to int
      group_major: formData.matricGroup,
      result_status: "Passed",
      roll_number: formData.matricRollNo,
      obtained_marks: parseInt(formData.matricObtainedMarks, 10)
    };
  
    const interPayload = {
      student_id: formData.student_id,
      education_system: formData.interSystem,
      board_university: formData.interBoard,
      institute: formData.interInstitute,
      passing_year: parseInt(formData.interYear, 10), // Convert passing year to int
      group_major: formData.interGroup,
      result_status: formData.interResultStatus,
      roll_number:
        ["Passed", "Awaited", "Supplementary"].includes(formData.interResultStatus)
          ? formData.interRollNo
          : "",
      obtained_marks:
        formData.interResultStatus === "Passed"
          ? parseInt(formData.interObtainedMarks, 10)
          : null
    };
  
    try {
      // Submit Matric Info
      let response = await fetch("http://localhost:3001/matriculation-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matricPayload),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error while submitting Matric info:", errorDetails);
        throw new Error(`Failed to submit Matric info: ${JSON.stringify(errorDetails)}`);
      }
  
      // If matric info is successful, submit Intermediate Info
      response = await fetch("http://localhost:3001/intermediate-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interPayload),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error while submitting Intermediate info:", errorDetails);
        throw new Error(`Failed to submit Intermediate info: ${JSON.stringify(errorDetails)}`);
      }
  
      console.log("Academic info saved successfully");
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
  

  // Render Matriculation Section
  const renderMatriculationSection = () => {
    const level = "matric";

    return (
      <div className={sectionClass}>
        <div className="flex items-center mb-6">
          <School className="w-6 h-6 text-teal-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Matriculation/O-Level Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education System */}
          <div>
            <label htmlFor={`${level}System`} className={labelClass}>
              Education System <span className="text-red-500">*</span>
            </label>
            <select
              id={`${level}System`}
              name={`${level}System`}
              value={formData[`${level}System`] || ""}
              onChange={handleChange}
              className={inputClass(errors[`${level}System`])}
              required
            >
              <option value="">Select Education System</option>
              {MATRIC_EDUCATION_SYSTEMS.map((system) => (
                <option key={system} value={system}>
                  {system}
                </option>
              ))}
            </select>
            {errors[`${level}System`] && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors[`${level}System`]}</span>
              </div>
            )}
          </div>

          {/* Board/University */}
          <div>
            <label htmlFor={`${level}Board`} className={labelClass}>
              Board/University <span className="text-red-500">*</span>
            </label>
            <select
              id={`${level}Board`}
              name={`${level}Board`}
              value={formData[`${level}Board`] || ""}
              onChange={handleChange}
              className={inputClass(errors[`${level}Board`])}
              required
            >
              <option value="">Select Board</option>
              {BOARDS.map((board) => (
                <option key={board} value={board}>
                  {board}
                </option>
              ))}
            </select>
            {errors[`${level}Board`] && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors[`${level}Board`]}</span>
              </div>
            )}
          </div>

          {/* Institute */}
          <div>
            <label htmlFor={`${level}Institute`} className={labelClass}>
              Institute <span className="text-red-500">*</span>
            </label>
            <input
              id={`${level}Institute`}
              type="text"
              name={`${level}Institute`}
              value={formData[`${level}Institute`] || ""}
              onChange={handleChange}
              className={inputClass(errors[`${level}Institute`])}
              placeholder="Enter institute name"
              required
            />
            {errors[`${level}Institute`] && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors[`${level}Institute`]}</span>
              </div>
            )}
          </div>

          {/* Passing Year */}
          <div>
            <label htmlFor={`${level}Year`} className={labelClass}>
              Passing Year <span className="text-red-500">*</span>
            </label>
            <select
              id={`${level}Year`}
              name={`${level}Year`}
              value={formData[`${level}Year`] || ""}
              onChange={handleChange}
              className={inputClass(errors[`${level}Year`])}
              required
            >
              <option value="">Select Year</option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors[`${level}Year`] && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors[`${level}Year`]}</span>
              </div>
            )}
          </div>

          {/* Group/Major */}
          <div>
            <label htmlFor={`${level}Group`} className={labelClass}>
              Group/Major <span className="text-red-500">*</span>
            </label>
            <select
              id={`${level}Group`}
              name={`${level}Group`}
              value={formData[`${level}Group`] || ""}
              onChange={handleChange}
              className={inputClass(errors[`${level}Group`])}
              required
            >
              <option value="">Select Group</option>
              {GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            {errors[`${level}Group`] && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors[`${level}Group`]}</span>
              </div>
            )}
          </div>

          {/* Result Status (Fixed as Passed) */}
          <div>
            <label htmlFor={`${level}ResultStatus`} className={labelClass}>
              Result Status
            </label>
            <input
              id={`${level}ResultStatus`}
              name={`${level}ResultStatus`}
              value="Passed"
              readOnly
              className={inputClass(false)}
            />
          </div>

          {/* Roll Number */}
          <div>
            <label htmlFor={`${level}RollNo`} className={labelClass}>
              Roll Number <span className="text-red-500">*</span>
            </label>
            <input
              id={`${level}RollNo`}
              type="text"
              name={`${level}RollNo`}
              value={formData[`${level}RollNo`] || ""}
              onChange={handleChange}
              className={inputClass(errors[`${level}RollNo`])}
              placeholder="Enter roll number"
              required
            />
            {errors[`${level}RollNo`] && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors[`${level}RollNo`]}</span>
              </div>
            )}
          </div>

          {/* Obtained Marks */}
          <div>
            <label htmlFor={`${level}ObtainedMarks`} className={labelClass}>
              Obtained Marks <span className="text-red-500">*</span>
            </label>
            <input
              id={`${level}ObtainedMarks`}
              type="number"
              name={`${level}ObtainedMarks`}
              value={formData[`${level}ObtainedMarks`] || ""}
              onChange={handleChange}
              className={inputClass(errors[`${level}ObtainedMarks`])}
              placeholder="Enter obtained marks"
              min="0"
              max="1100"
              required
            />
            {errors[`${level}ObtainedMarks`] && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors[`${level}ObtainedMarks`]}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render Intermediate Section
  const renderIntermediateSection = () => {
    const level = "inter";
    const ResultStatus = formData[`${level}ResultStatus`];
    const matricYear = formData["matricYear"]
      ? parseInt(formData["matricYear"])
      : null;

    // Generate passing years for Intermediate, starting two years after Matriculation year
    const currentYear = new Date().getFullYear();
    let interYears = [];

    if (matricYear) {
      for (let year = matricYear + 2; year <= currentYear; year++) {
        interYears.push(year);
      }
    } else {
      // If matricYear is not selected yet, allow the last 20 years as default
      interYears = YEARS;
    }

    return (
      <div className={sectionClass}>
        <div className="flex items-center mb-6">
          <GraduationCap className="w-6 h-6 text-teal-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Intermediate/A-Level Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education System */}
          <div>
            <label htmlFor={`${level}System`} className={labelClass}>
              Education System <span className="text-red-500">*</span>
            </label>
            <select
              id={`${level}System`}
              name={`${level}System`}
              value={formData[`${level}System`] || ""}
              onChange={handleChange}
              className={inputClass(errors[`${level}System`])}
              required
            >
              <option value="">Select Education System</option>
              {INTER_EDUCATION_SYSTEMS.map((system) => (
                <option key={system} value={system}>
                  {system}
                </option>
              ))}
            </select>
            {errors[`${level}System`] && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors[`${level}System`]}</span>
              </div>
            )}
          </div>

          {/* Board/University */}
          <div>
            <label htmlFor={`${level}Board`} className={labelClass}>
              Board/University <span className="text-red-500">*</span>
            </label>
            <select
              id={`${level}Board`}
              name={`${level}Board`}
              value={formData[`${level}Board`] || ""}
              onChange={handleChange}
              className={inputClass(errors[`${level}Board`])}
              required
            >
              <option value="">Select Board</option>
              {BOARDS.map((board) => (
                <option key={board} value={board}>
                  {board}
                </option>
              ))}
            </select>
            {errors[`${level}Board`] && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors[`${level}Board`]}</span>
              </div>
            )}
          </div>

          {/* Institute */}
          <div>
            <label htmlFor={`${level}Institute`} className={labelClass}>
              Institute <span className="text-red-500">*</span>
            </label>
            <input
              id={`${level}Institute`}
              type="text"
              name={`${level}Institute`}
              value={formData[`${level}Institute`] || ""}
              onChange={handleChange}
              className={inputClass(errors[`${level}Institute`])}
              placeholder="Enter institute name"
              required
            />
            {errors[`${level}Institute`] && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors[`${level}Institute`]}</span>
              </div>
            )}
          </div>

          {/* Passing Year */}
          <div>
            <label htmlFor={`${level}Year`} className={labelClass}>
              Passing Year <span className="text-red-500">*</span>
            </label>
            <select
              id={`${level}Year`}
              name={`${level}Year`}
              value={formData[`${level}Year`] || ""}
              onChange={handleChange}
              className={inputClass(errors[`${level}Year`])}
              required
            >
              <option value="">Select Year</option>
              {interYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors[`${level}Year`] && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors[`${level}Year`]}</span>
              </div>
            )}
          </div>

          {/* Group/Major */}
          <div>
            <label htmlFor={`${level}Group`} className={labelClass}>
              Group/Major <span className="text-red-500">*</span>
            </label>
            <select
              id={`${level}Group`}
              name={`${level}Group`}
              value={formData[`${level}Group`] || ""}
              onChange={handleChange}
              className={inputClass(errors[`${level}Group`])}
              required
            >
              <option value="">Select Group</option>
              {GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            {errors[`${level}Group`] && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors[`${level}Group`]}</span>
              </div>
            )}
          </div>

          {/* Result Status */}
          <div>
            <label htmlFor={`${level}ResultStatus`} className={labelClass}>
              Result Status <span className="text-red-500">*</span>
            </label>
            <select
              id={`${level}ResultStatus`}
              name={`${level}ResultStatus`}
              value={formData[`${level}ResultStatus`] || ""}
              onChange={handleChange}
              className={inputClass(errors[`${level}ResultStatus`])}
              required
            >
              <option value="">Select Result Status</option>
              {RESULT_STATUS_INTER.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors[`${level}ResultStatus`] && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors[`${level}ResultStatus`]}</span>
              </div>
            )}
          </div>

          {/* Roll Number */}
          <div>
            <label htmlFor={`${level}RollNo`} className={labelClass}>
              Roll Number{" "}
              {["Passed", "Awaited", "Supplementary"].includes(ResultStatus) && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              id={`${level}RollNo`}
              type="text"
              name={`${level}RollNo`}
              value={formData[`${level}RollNo`] || ""}
              onChange={handleChange}
              className={inputClass(errors[`${level}RollNo`])}
              placeholder="Enter roll number"
              required={["Passed", "Awaited", "Supplementary"].includes(
                ResultStatus
              )}
              disabled={!ResultStatus}
            />
            {errors[`${level}RollNo`] && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors[`${level}RollNo`]}</span>
              </div>
            )}
          </div>

          {/* Obtained Marks */}
          <div>
            <label htmlFor={`${level}ObtainedMarks`} className={labelClass}>
              Obtained Marks{" "}
              {ResultStatus === "Passed" && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              id={`${level}ObtainedMarks`}
              type="number"
              name={`${level}ObtainedMarks`}
              value={formData[`${level}ObtainedMarks`] || ""}
              onChange={handleChange}
              className={inputClass(errors[`${level}ObtainedMarks`])}
              placeholder="Enter obtained marks"
              min="0"
              max="1100"
              disabled={ResultStatus !== "Passed"}
              required={ResultStatus === "Passed"}
            />
            {errors[`${level}ObtainedMarks`] && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {errors[`${level}ObtainedMarks`]}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={submitForm}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Information Block */}
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
              Please ensure all academic information matches your certificates
              exactly
            </li>
            <li>
              Roll number is required if your result status is "Passed,"
              "Awaited," or "Supplementary"
            </li>
            <li>
              Obtained marks are required only if your result status is "Passed"
            </li>
            <li>
              Intermediate passing year must be at least two years after
              Matriculation passing year
            </li>
            <li>
              For O/A-Level students, please provide equivalence certificate
              details
            </li>
            <li>
              Maximum marks allowed is 1100 for both education levels
            </li>
            <li>
              Institute name should match exactly as mentioned in your
              certificate
            </li>
          </ul>
        </div>

        {renderMatriculationSection()}
        {renderIntermediateSection()}

        <button
          type="submit"
          className="w-full mt-6 p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Save Information"}
        </button>
      </div>
    </form>
  );
};

export default AcademicInfoForm;
