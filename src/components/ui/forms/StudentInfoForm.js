import React, { useState } from "react";
import { Upload, X, Camera, AlertCircle, CheckCircle2 } from "lucide-react";

const StudentInfoForm = ({ formData = {}, onChange, onValidation }) => {
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(
    formData.profileImagePreview || ""
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = (error) =>
    `
    w-full p-3 border rounded-lg transition-all duration-200
    ${
      error
        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-400"
        : "border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
    }
    hover:border-teal-300
  `;

  const validateField = (name, value) => {
    let fieldErrors = { ...errors };
    switch (name) {
      case "first_name":
        fieldErrors.first_name = !value?.trim() ? "First name is required" : "";
        break;
      case "last_name":
        fieldErrors.last_name = !value?.trim() ? "Last name is required" : "";
        break;
      case "email":
        fieldErrors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Please enter a valid email address"
          : "";
        break;
      case "phone_number":
        fieldErrors.phone_number = !/^[\d\s-+()]{10,}$/.test(value)
          ? "Please enter a valid phone number"
          : "";
        break;
      default:
        break;
    }
    setErrors(fieldErrors);
    return !Object.values(fieldErrors).some((error) => error);
  };

  const validateForm = () => {
    const requiredFields = ["first_name", "last_name", "email", "phone_number"];
    let formErrors = {};
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        formErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")
        } is required`;
        isValid = false;
      } else {
        // Validate individual fields again
        if (!validateField(field, formData[field])) {
          isValid = false;
        }
      }
    });

    if (!formData.profileImage && !previewUrl) {
      formErrors.profileImage = "Profile photo is required";
      isValid = false;
    }

    setErrors(formErrors);

    return isValid;
  };

  const markUnsavedChanges = () => {
    // The step is not saved after changes
    if (typeof onValidation === "function") {
      onValidation(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    onChange(newData);
    validateField(name, value);
    markUnsavedChanges();
  };

  const handlePhotoFile = (file) => {
    markUnsavedChanges();
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Photo size should be less than 5MB",
      }));
      return;
    }

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Please upload a JPG or PNG file",
      }));
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onChange({ ...formData, profileImage: file, profileImagePreview: url });
    setErrors((prev) => ({ ...prev, profileImage: "" }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) handlePhotoFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handlePhotoFile(file);
  };

  const removePhoto = () => {
    markUnsavedChanges();
    setPreviewUrl("");
    onChange({ ...formData, profileImage: null, profileImagePreview: null });
    setErrors((prev) => ({
      ...prev,
      profileImage: "Profile photo is required",
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      if (typeof onValidation === "function") {
        onValidation(false);
      }
      return;
    }

    setIsSubmitting(true);

    // const fetchStudentId = async (id) => {
    //   const response = await fetch(`http://localhost:3001/${id}`);
    //   if (!response.ok) {
    //     console.log(`${id} not present`);
    //     return `id not found`;
    //   }
    //   return response;
    // };

    console.log("formData.student_id:", formData.student_id);
    const method = formData.student_id ? "PATCH" : "POST";
    const url = formData.student_id
      ? `http://localhost:3001/students/${formData.student_id}`
      : "http://localhost:3001/students";

    const form = new FormData();
    form.append("first_name", formData.first_name);
    form.append("last_name", formData.last_name);
    form.append("email", formData.email);
    form.append("phone_number", formData.phone_number);
    if (formData.profileImage instanceof File) {
      form.append("profileImage", formData.profileImage);
    }

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone_number: formData.phone_number,
    };
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log(typeof form);
      console.log(`body: ${form.get("email")}`);
      console.log(`response on FE`, response);

      if (!response.ok) {
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        };
        let responseBody;
        try {
          responseBody = await response.json();
        } catch {
          try {
            responseBody = await response.text();
          } catch {
            responseBody = "Unable to parse response body.";
          }
        }
        errorDetails.body = responseBody;
        console.log(formData);
        console.error("Error while submitting the form:", errorDetails);
        throw new Error(
          `Failed to submit the form: ${JSON.stringify(errorDetails)}`
        );
      }

      const result = await response.json();
      console.log("Form submitted successfully", result);
      console.log(`Student_id===>`, result.student_id);

      // If POST was used and we got a student_id in response, store it for future PATCH requests
      if (!formData.student_id && result.student_id) {
        onChange({ ...formData, student_id: result.student_id });
      }

      // After successful submission, mark the step as saved
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

  const sectionClass =
    "bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className={sectionClass}>
        <div className="flex items-center mb-6">
          <Camera className="w-6 h-6 text-teal-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Student Information
          </h2>
        </div>

        {/* Photo Upload Section */}
        <div className="mb-8">
          <label className={labelClass}>
            Profile Photo <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-8">
            {previewUrl ? (
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  className="w-40 h-40 rounded-lg object-cover border-2 border-teal-500 transition-all duration-300 group-hover:border-4"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg" />
                <button
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 shadow-lg"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                className="relative"
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                }}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="photo"
                  name="profileImage"
                  accept="image/jpeg,image/png"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label
                  htmlFor="photo"
                  className={`
                    flex flex-col items-center justify-center w-40 h-40
                    border-2 border-dashed rounded-lg cursor-pointer
                    transition-all duration-300
                    ${
                      isDragOver
                        ? "border-teal-500 bg-teal-50"
                        : errors.profileImage
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-teal-400 hover:bg-teal-50"
                    }
                  `}
                >
                  <Upload
                    className={`w-8 h-8 mb-2 ${
                      errors.profileImage ? "text-red-400" : "text-teal-500"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      errors.profileImage ? "text-red-500" : "text-gray-600"
                    }`}
                  >
                    {isDragOver ? "Drop photo here" : "Upload Photo"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Click or drag & drop
                  </span>
                </label>
              </div>
            )}

            <div className="flex-1">
              <div
                className={`p-4 rounded-lg ${
                  errors.profileImage
                    ? "bg-red-50 border border-red-100"
                    : "bg-teal-50 border border-teal-100"
                }`}
              >
                <h3 className="font-medium text-gray-700 mb-2">
                  Photo Requirements:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 mr-2" />
                    Maximum file size: 5MB
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 mr-2" />
                    Supported formats: JPG, PNG
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 mr-2" />
                    Recent passport-sized photo
                  </li>
                </ul>
              </div>
              {errors.profileImage && (
                <div className="flex items-center mt-2 text-red-500">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{errors.profileImage}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
              className={inputClass(errors.first_name)}
              placeholder="Enter your first name"
            />
            {errors.first_name && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.first_name}</span>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
              className={inputClass(errors.last_name)}
              placeholder="Enter your last name"
            />
            {errors.last_name && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.last_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className={labelClass}>
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className={inputClass(errors.email)}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.email}</span>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number || ""}
              onChange={handleChange}
              className={inputClass(errors.phone_number)}
              placeholder="+92-XXX-XXXXXXX"
            />
            {errors.phone_number && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.phone_number}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Information Button */}
      <button
        onClick={submitForm}
        type="submit"
        className="w-full mt-6 p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Save Information"}
      </button>
    </div>
  );
};

export default StudentInfoForm;

// Second Integration
